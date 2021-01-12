class ProtocolEntityPostCommunity2 < ProtocolEntity2
  PREFIX = '11'
  attr_reader :community_name
  attr_reader :post_body

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX


    arg1unpacked = [@args.first].pack('H*')
    arg2unpacked = [@args.second].pack('H*')
    @comm = arg1unpacked
    @post_body = arg2unpacked
    {
        community_name: @comm,
        post_body: @post_body
    }
  end

  def self.from_entity(entity, created_by_address)
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            ProtocolParserFactory::utf8_to_hex(entity[:community_name]),
            ProtocolParserFactory::utf8_to_hex(entity[:post_body])
        ]
    )
    return ProtocolEntityPostCommunity2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def self.create_and_attach_hashtags(txhash, hashtags)
    hashtags.each do |hashtag|
      cleaned_hashtag = hashtag.gsub('#', '')
      AddressHashtag.find_or_create_by!(:hashtag => cleaned_hashtag)
      AddressPostHashtagMapping.find_or_create_by(:post_tx_id => txhash,
                                                  :hashtag => cleaned_hashtag)
    end
  end

  def get_params
    [@comm, @post_body]
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def do_populate_domain!(block_id, block_time, is_mempool = false)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    if @post_body.blank? || @post_body.blank?
      return
    end

    if @comm.blank? || @comm.blank?
      return
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    entity = AddressPost.find_or_create_by!(:address_id => @created_by_address, :action_tx => @txhash)
    entity.action_tx = @txhash
    entity.action_tx_block_id = block_id
    entity.action_tx_is_mempool = 0
    entity.post_body = @post_body
    entity.community = @comm
    entity.post_created_at = block_time
    begin
      entity.save
    rescue => e
      # skip error Incorrect string value: '\xA46\x16\xE6\xE6\xF7...' for colum
    end
    # Get hash tags and create them if needed, then link them
    hashtags = @post_body.scan(/#\w+/).flatten
    ProtocolEntityPost.create_and_attach_hashtags(@txhash, hashtags)
  end
end