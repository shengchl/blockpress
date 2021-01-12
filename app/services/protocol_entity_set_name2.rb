class ProtocolEntitySetName2 < ProtocolEntity2
  PREFIX = '01'

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX

    @payload = payload
    arg1unpacked = [@args.first].pack('H*')
    @set_name_name = arg1unpacked
    {
        name: @set_name_name
    }
  end

  def self.from_entity(entity, created_by_address)
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            ProtocolParserFactory::utf8_to_hex(entity[:name])
        ]
    )
    return ProtocolEntitySetName2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end

  def get_params
    [@set_name_name]
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end


  def do_populate_domain!(block_id, block_time, is_mempool = false)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    if address.set_profile_name_block_id.blank? || block_id >= address.set_profile_name_block_id
      address.set_profile_name_tx = @txhash
      address.set_profile_name_block_id = block_id
      address.set_profile_name_is_mempool = 0
      address.name = @set_name_name
      address.save!
      return
    end
  end
end