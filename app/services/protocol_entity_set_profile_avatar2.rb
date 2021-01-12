class ProtocolEntitySetProfileAvatar2 < ProtocolEntity2
  PREFIX = '10'

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX
    arg1unpacked = [@args.first].pack('H*')
    @set_profile_avatar_ipfs = arg1unpacked
    {
        ipfs: arg1unpacked
    }
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def get_params
    [@set_profile_avatar_ipfs]
  end

  def self.from_entity(entity, created_by_address)
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            ProtocolParserFactory::utf8_to_hex(entity[:ipfs])
        ]
    )
    return ProtocolEntitySetProfileAvatar2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def do_populate_domain!(block_id, block_time, is_mempool = false)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    if address.set_profile_avatar_block_id.blank? || block_id >= address.set_profile_avatar_block_id
      address.set_profile_avatar_tx = @txhash
      address.set_profile_avatar_block_id = block_id
      address.set_profile_avatar_is_mempool = 0
      address.avatar = @set_profile_avatar_ipfs
      address.save!
      return
    end
  end
end