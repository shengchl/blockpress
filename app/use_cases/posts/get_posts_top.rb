require 'bitcoin'

class Posts::GetPostsTop < ActiveInteraction::Base
  integer :offset_id, default: 0
  string :range, default: '1525132800'
  boolean :depth, default: true # Whether to fetch subposts
  integer :count, default: 25

  def execute
    query_result = nil
    if offset_id && offset_id > 0
      query_result = ActiveRecord::Base.connection.execute <<-eos.squish
        SELECT a.action_tx, count(b.reply_to_tx_id) as like_count
        FROM
        address_posts a, address_posts b
        WHERE
        a.post_created_at > #{ActiveRecord::Base::sanitize(range)}
        AND
        a.action_tx = b.reply_to_tx_id
        GROUP BY a.action_tx
        ORDER BY like_count DESC
        LIMIT #{offset_id * count}, #{count}
      eos
    else
      query_result = ActiveRecord::Base.connection.execute <<-eos.squish
        SELECT a.action_tx, count(b.reply_to_tx_id) as like_count
        FROM
        address_posts a, address_posts b
        WHERE
        a.post_created_at > #{ActiveRecord::Base::sanitize(range)}
        AND
        a.action_tx = b.reply_to_tx_id
        GROUP BY a.action_tx
        ORDER BY like_count DESC
        LIMIT #{count}
      eos
    end

    post_ids = []
    query_result.each do |row|
      post_ids << row[0]
    end
    posts = AddressPost.where('action_tx in (?)', post_ids).all

    Posts::GetPosts.construct_returns(posts, depth)

  end
end


