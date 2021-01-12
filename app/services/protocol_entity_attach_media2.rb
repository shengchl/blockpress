class ProtocolEntityAttachMedia2 < ProtocolEntity2
  PREFIX = '0A'

  attr_reader :caption
  attr_reader :link

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX


    check_http =  [@args.first].pack('H*')

    if check_http =~ /^.*https?/
      @image_link_or_ipfs = check_http
    else
      # Must be IPFS
      ipfs_hash_int = @args.first.to_i(16)
      back_to_ipfs_hash = Base58.int_to_base58(ipfs_hash_int)
      @image_link_or_ipfs = back_to_ipfs_hash
    end

    if @args.second.blank?
      @caption = nil
    else
      arg2unpacked = [@args.second].pack('H*')
      @caption = arg2unpacked
    end

    {
        image_link_or_ipfs: @image_link_or_ipfs,
        caption: @caption
    }
  end

  def self.from_entity(entity, created_by_address)
    image_link_or_ipfs = nil

    if entity[:image_link_or_ipfs] =~ /^.*https?/
      image_link_or_ipfs = ProtocolParserFactory::utf8_to_hex(entity[:image_link_or_ipfs])
    else
      # Must be ipfs
      ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
      ipfs_hash_hex = ipfs_hash.to_s(16)
      image_link_or_ipfs = ipfs_hash_hex
    end

    array_args = [
        image_link_or_ipfs
    ]

    if !entity[:caption].blank?
      array_args << ProtocolParserFactory::utf8_to_hex(entity[:caption])
    end

    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        array_args
    )

    return ProtocolEntityAttachMedia2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def do_populate_domain!(block_id, block_time, is_mempool = false)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    entity = AddressImage.find_or_create_by!(:address_id => @created_by_address, :action_tx => @txhash)
    entity.action_tx = @txhash
    entity.action_tx_block_id = block_id
    entity.action_tx_is_mempool = is_mempool
    entity.image_link_or_ipfs = @image_link_or_ipfs
    entity.caption = @caption
    entity.image_created_at = block_time
    begin
      entity.save
    rescue => e
      # skip error Incorrect string value: '\xA46\x16\xE6\xE6\xF7...' for colum
    end
  end
end