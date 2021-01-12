require 'bitcoin'

class Posts::CreateReply < ActiveInteraction::Base

  string :body
  integer :user_id
  string :tx_id
  integer :tip, default: 0

  def execute
    user = User.find_by_id(user_id)
    address_cash = user.address_cash

    p = ProtocolEntityPostReply2.from_entity({
                                        :reply_to_tx_id => tx_id,
                                        :post_body => body.squish,
                                       }, address_cash)

    publish_result = Wallets::PublishTx.run!(:user_id => user_id,
                                             :address_cash => address_cash,
                                             :protocol_entity2 => p)
    raise 'error' unless publish_result[:success]
    publish_result

    p.populate_domain!(publish_result[:object]['tx_hash'],
                       BitcoinRpcService.get_block_height['height'],
                       Time.now.to_i,
                       true)
    Users::IncrementBadgeCountForTxOwnerAddress.run!(tx_id: tx_id)

    publish_result.merge({
      :txid => publish_result[:object]['tx_hash'],
      :authorId => address_cash,
      :createdAt => Time.now.to_i
    })
  end
end


