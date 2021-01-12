require 'bitcoin'

class Posts::CreatePostMedia < ActiveInteraction::Base

  string :body, default: nil
  string :media_payload
  integer :user_id

  def execute
    user = User.find_by_id(user_id)
    address_cash = user.address_cash

    # Clean up newlines or it breaks
    if body
      body = body.squish
    end
    p = ProtocolEntityPostMedia2.from_entity({
                                        :media_payload => media_payload,
                                        :post_body => body
                                       }, address_cash)
    return
    publish_result = Wallets::PublishTx.run!(:user_id => user_id,
                                             :address_cash => address_cash,
                                             :protocol_entity2 => p)
    raise 'error' unless publish_result[:success]
    publish_result

    p.populate_domain!(publish_result[:object]['tx_hash'],
                       BitcoinRpcService.get_block_height['height'],
                       Time.now.to_i,
                       true)

    # Users::IncrementBadgeCountsForFollowers.run!(address: address_cash)

    publish_result.merge({
      :txid => publish_result[:object]['tx_hash'],
      :authhorId => address_cash,
      :createdAt => Time.now.to_i
    })
  end
end


