class ProtocolEntityFollow2 < ProtocolEntity2
  PREFIX = '06'

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX

    arg1unpacked = [@args.first].pack('H*')
    @follow_address = Cashaddress.from_legacy(arg1unpacked).gsub('bitcoincash:', '')
    {
        follow_address: @follow_address
    }
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def self.from_entity(entity, created_by_address)
    legacy = Cashaddress.to_legacy('bitcoincash:' + entity[:follow_address])
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            ProtocolParserFactory::utf8_to_hex(legacy),
        ]
    )
    return ProtocolEntityFollow2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end


  def get_params
    [@follow_address]
  end

  def do_populate_domain!(block_id, block_time, is_mempool)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)
    following_address = ProtocolEntity.get_address_ident(@follow_address)

    # 000000000000000000a1a8ef2a6bb8f8d0b368b6ab456c7d07cfe583a88c4585
    entity = AddressFollowing.find_or_initialize_by(:follower_address_id => address.address_id,
                                                    :following_address_id => following_address.address_id)
    if entity.action_tx_block_id.blank? || block_id >= entity.action_tx_block_id
      entity.action_tx = @txhash
      entity.action_tx_block_id = block_id
      entity.action_tx_is_mempool = 0
      entity.deleted = 0
      entity.save!
    end
  end
end