require 'bitcoin'

class Posts::CreateLike < ActiveInteraction::Base

  string :body, default: nil
  integer :user_id
  string :tx_id
  integer :tip, default: 0

  def execute

    user = User.find_by_id(user_id)
    address_cash = user.address_cash

    p = ProtocolEntityPostLike2.from_entity({
                                        :reply_to_tx_id => tx_id,
                                        :post_body => body,
                                       }, address_cash)

    post_being_liked = AddressPost.where(:action_tx => tx_id).first
    raise 'Fatal not found post' if post_being_liked.nil?
    @address_id_getting_tipped = post_being_liked.address_id

    publish_result = Wallets::PublishTx.run!(:user_id => user_id,
                                             :address_cash => address_cash,
                                             :address_id_getting_tipped => @address_id_getting_tipped,
                                             :tip => tip,
                                             :protocol_entity2 => p)
    raise 'error' unless publish_result[:success]
    tx = BitcoinRpcService.get_transaction(publish_result[:object]['tx_hash'])

    raise 'sync fail' unless BlockSyncService.sync_tx!(tx, BitcoinRpcService.get_block_height['height'], true, Time.now.to_i, true)

    Users::IncrementBadgeCountForTxOwnerAddress.run!(tx_id: tx_id)

    publish_result.merge({
      :txid => publish_result[:object]['tx_hash'],
      :authorId => address_cash,
      :createdAt => Time.now.to_i
    })
  end
end


