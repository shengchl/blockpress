class Users::IncrementBadgeCountForTxOwnerAddress < ActiveInteraction::Base

  string :tx_id

  def execute
    address_post = AddressPost.where(action_tx: tx_id).first
    users = User.joins("INNER JOIN address_posts ON address_posts.address_id = users.address_cash AND address_posts.action_tx = '#{tx_id}'").all
    # multiple users can have same address
    users.each do |u|
      # next if address_post.address_id == u.address_cash
      u.badge_count =  u.badge_count.blank? ? 1 : u.badge_count + 1
      u.save
    end
  end
end


