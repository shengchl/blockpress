class ProtocolEntityPostMedia2 < ProtocolEntity2
  PREFIX = '09'

  attr_reader :media_type
  attr_reader :post_body
  attr_reader :media_payload

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX
    raise ProtocolEntity::DomainError.new unless @args.first == '01'

    if @args.first == '01'
      @media_type = 1
    end

    check_http =  [@args.second].pack('H*')
    if check_http =~ /^.*https?/
      @media_payload = check_http
    else
      # Must be IPFS
      ipfs_hash_int = @args.second.to_i(16)
      back_to_ipfs_hash = Base58.int_to_base58(ipfs_hash_int)
      @media_payload = back_to_ipfs_hash
    end

    if @args.third.blank?
      @post_body = nil
    else
      arg2unpacked = [@args.third].pack('H*')
      @post_body = arg2unpacked
    end

    {
        media_type: @media_type,
        media_payload: @media_payload,
        post_body: @post_body
    }
  end

  def self.get_media_type_hex(media_type_int)
    if media_type_int == 1
      media_payload_hex = '01'
    else
      raise ProtocolEntity::DomainError.new
    end
    media_payload_hex
  end

  def self.from_entity(entity, created_by_address)
    raise ProtocolEntity::DomainError.new unless entity[:media_type] == 1
    media_payload_hex = nil

    if entity[:media_type] == 1
      media_payload_hex = ProtocolParserFactory::utf8_to_hex(entity[:media_payload])
      if entity[:media_payload] =~ /^.*https?/
        media_payload_hex = ProtocolParserFactory::utf8_to_hex(entity[:media_payload])
      else
        # Assume ipfs
        ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
        media_payload_hex = ipfs_hash.to_s(16)
      end
    else
      raise ProtocolEntity::DomainError.new
    end

    array_args = [
        get_media_type_hex(entity[:media_type]),
        media_payload_hex
    ]

    if !entity[:post_body].blank?
      array_args << ProtocolParserFactory::utf8_to_hex(entity[:post_body])
    end

    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        array_args
    )
    return ProtocolEntityPostMedia2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def do_populate_domain!(block_id, block_time, is_mempool = false)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    entity = AddressPost.find_or_create_by!(:address_id => @created_by_address, :action_tx => @txhash)
    entity.action_tx = @txhash
    entity.action_tx_block_id = block_id
    entity.action_tx_is_mempool = 0
    entity.media_type = @media_type
    entity.media_payload = @media_payload
    entity.post_body = @post_body
    entity.post_created_at = block_time
    begin
      entity.save
    rescue => e
      # skip error Incorrect string value: '\xA46\x16\xE6\xE6\xF7...' for colum
    end
    # Get hash tags and create them if needed, then link them
    if !@post_body.blank?
      hashtags = @post_body.scan(/#\w+/).flatten
      ProtocolEntityPost.create_and_attach_hashtags(@txhash, hashtags)
    end
  end
end