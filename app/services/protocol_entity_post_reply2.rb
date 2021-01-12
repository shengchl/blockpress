class ProtocolEntityPostReply2 < ProtocolEntity2
  PREFIX = '03'

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX

    @reply_to_tx_id = @args.first
    raise ProtocolEntity::DomainError.new if @reply_to_tx_id.length != 64
    arg2unpacked = [@args.second].pack('H*')
    @post_body = arg2unpacked
    {
        post_body: @post_body,
        reply_to_tx_id: @reply_to_tx_id,
    }
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def self.from_entity(entity, created_by_address)
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            entity[:reply_to_tx_id],
            ProtocolParserFactory::utf8_to_hex(entity[:post_body])
        ]
    )
    return ProtocolEntityPostReply2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def get_params
    [@reply_to_tx_id, @post_body]
  end


  def do_populate_domain!(block_id, block_time, is_mempool)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    if @reply_to_tx_id.blank? || @reply_to_tx_id.length != 64
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    begin
      entity = AddressPost.find_or_create_by!(:address_id => @created_by_address, :action_tx => @txhash)
      entity.action_tx = @txhash
      entity.action_tx_block_id = block_id
      entity.action_tx_is_mempool = 0
      entity.reply_to_tx_id = @reply_to_tx_id
      entity.post_body = @post_body
      entity.post_created_at = block_time
      entity.save!
    rescue => e
      puts 'exception reply2' + e.to_s
      # skip error Incorrect string value: '\xA46\x16\xE6\xE6\xF7...' for colum
    end
    # Get hash tags and create them if needed, then link them
    hashtags = @post_body.scan(/#\w+/).flatten
    ProtocolEntityPost.create_and_attach_hashtags(@txhash, hashtags)
  end

end