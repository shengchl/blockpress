require 'bitcoin'

class Posts::GetReplyFeed < ActiveInteraction::Base
  string :address_id
  integer :offset_id, default: 0
  integer :count, default: 22

  def execute
    query_result = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT b.action_tx
      FROM
      address_posts a, address_posts b
      WHERE
      a.address_id = "#{address_id}"
      AND
      a.action_tx = b.reply_to_tx_id
      ORDER BY b.post_created_at DESC
      LIMIT #{offset_id * count}, #{count}
    eos

    users = User.where(:address_cash => address_id).all
    users.each do |u|
      u.badge_count = 0
      u.save
    end

    post_ids = []
    query_result.each do |row|
      post_ids << row[0]
    end
    posts = AddressPost.where('action_tx in (?)', post_ids).all.order('post_created_at DESC')
    Posts::GetPosts.construct_returns(posts, true)
  end
end


