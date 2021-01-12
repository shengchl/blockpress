
class PopulateDomain < ActiveInteraction::Base

  object :entity
  integer :block_id
  integer :block_time

  def get_init_address(address_id)
    address = AddressIdent.find_by_address_id(address_id)
    if address.blank?
      # Make sure to get the legacy format
      legacy = Cashaddress.to_legacy('bitcoincash:' + address_id.to_s)
      (hex, hex_trunc) = BitcoinAddressUtil.get_hex_versions(legacy)
      address = AddressIdent.find_or_create_by!({
          :address_id => address_id,
          :address_id_hex => hex,
          :address_id_hex_trunc => hex_trunc,
      })
    end
    address
  end


  def set_profile_text(action_tx, address_id, block_id, is_mempool, profile_bio)
    address = get_init_address(address_id)

    if address.set_profile_bio_block_id.blank? || block_id >= address.set_profile_bio_block_id
      address.set_profile_bio_tx = action_tx
      address.set_profile_bio_block_id = block_id
      address.set_profile_bio_is_mempool = is_mempool
      address.bio = profile_bio
      address.save!
    end
    true
  end




  # Because memo did a hack with truncating the hex addresses, we are using that to
  # determine which users follow whom.
  def follow(action_tx, address_id, block_id, is_mempool, address_hex_trunc)
    address = get_init_address(address_id)
    entity = AddressFollowing.find_or_initialize_by(:follower_address_id => address_id,
                                               :following_address_id_hex_trunc => address_hex_trunc)
    if entity.action_tx_block_id.blank? || block_id >= entity.action_tx_block_id
      entity.action_tx = action_tx
      entity.action_tx_block_id = block_id
      entity.action_tx_is_mempool = is_mempool
      entity.deleted = 0
      entity.save!
    end

    true
  end

  # Because memo did a hack with truncating the hex addresses, we are using that to
  # determine which users follow whom.
  def unfollow(action_tx, address_id, block_id, is_mempool, address_hex_trunc)
    address = get_init_address(address_id)
    entity = AddressFollowing.find_or_initialize_by(:follower_address_id => address_id,
                                                    :following_address_id_hex_trunc => address_hex_trunc)
    if entity.action_tx_block_id.blank? || block_id >= entity.action_tx_block_id
      entity.action_tx = action_tx
      entity.action_tx_block_id = block_id
      entity.action_tx_is_mempool = is_mempool
      entity.deleted = 1
      entity.save!
    end

    true
  end

  def like(action_tx, address_id, block_id, is_mempool, like_tx, tip_address, tip_value)
    address = get_init_address(address_id)
    tip_address_addy = tip_address.blank? ? nil : get_init_address(tip_address)
    entity = AddressLike.find_or_initialize_by(:action_tx => action_tx)
    entity.action_tx = action_tx
    entity.action_tx_block_id = block_id
    entity.action_tx_is_mempool = is_mempool
    entity.liker_address_id = address_id
    entity.tip_receiver_address_id = tip_address
    entity.like_tx = like_tx

    amount = 0.00000001
    sats = tip_value.blank? ? 0 : tip_value / amount
    entity.tip_amount = sats
    entity.save!
    true
  end

  def execute

    if entity.instance_of?(ProtocolEntitySetName)
      return set_profile_name(action_tx, created_by_address_id, block_id, is_mempool,
                                entity[:obj][:name])
    end


    return nil
  end
end


