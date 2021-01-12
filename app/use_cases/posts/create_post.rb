require 'bitcoin'

class Posts::CreatePost < ActiveInteraction::Base

  string :media_payload, default: nil
  string :body
  integer :user_id

  def execute
    user = User.find_by_id(user_id)
    address_cash = user.address_cash

    p = nil

    if !media_payload.blank?
      # Clean up newlines or it breaks
      p = ProtocolEntityPostMedia2.from_entity({
                                              :media_type => 1,
                                              :media_payload => media_payload,
                                              :post_body => body.squish
                                          }, address_cash)
    else
      # Clean up newlines or it breaks
      p = ProtocolEntityPost2.from_entity({
                                              :post_body => body.squish
                                          }, address_cash)
    end


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


