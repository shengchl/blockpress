 class PostMetadataService
  def self.get_metadata_for_posts(posts)
    return {} unless posts && posts.size > 0
    # Query for total tips for a post
    post_ids = posts.map(&:action_tx)
    post_ids = "'#{post_ids.join("','")}'"
    exec_tip_results = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT address_posts.reply_to_tx_id, sum(address_posts.tip_amount) as tips
      FROM
      address_posts
      WHERE address_posts.reply_to_tx_id
      IN
      (#{post_ids})
      GROUP BY address_posts.reply_to_tx_id
    eos
    metadata = {}
    exec_tip_results.each do |row|
      post_tx = row[0]
      metadata[post_tx] = (metadata[post_tx] || {}).merge({ tips_total: row[1] })
    end

    exec_like_count_results = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT address_posts.reply_to_tx_id, count(*) as like_count
      FROM
      address_posts
      WHERE address_posts.reply_to_tx_id
      IN
      (#{post_ids})
      AND
      is_like = 1
      GROUP BY address_posts.reply_to_tx_id
    eos

    exec_like_count_results.each do |row|
      post_tx = row[0]
      metadata[post_tx] = (metadata[post_tx] || {}).merge({ like_count: row[1] })
    end

    exec_reply_count_results = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT address_posts.reply_to_tx_id, count(*) as reply_count
      FROM
      address_posts
      WHERE address_posts.reply_to_tx_id
      IN
      (#{post_ids})
      AND
      (is_like <> 1 OR is_like IS NULL)
      GROUP BY address_posts.reply_to_tx_id
    eos

    exec_reply_count_results.each do |row|
      post_tx = row[0]
      metadata[post_tx] = (metadata[post_tx] || {}).merge({ reply_count: row[1] })
    end
    metadata
  end

  def self.get_like_tip_data_for_posts(posts)
    return {} unless posts && posts.size > 0
    # Query for total tips for a post
    like_posts = []
    posts.each do |post|
      next unless post.is_like == 1
      like_posts << post
    end
    return {} unless !like_posts.empty?

    post_ids = like_posts.map(&:action_tx)
    post_ids = "'#{post_ids.join("','")}'"
    exec_tip_results = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT address_posts.reply_to_tx_id, sum(address_posts.tip_amount) as tip_total
      FROM
      address_posts
      WHERE address_posts.reply_to_tx_id
      IN
      (#{post_ids})
      AND
      GROUP BY address_posts.reply_to_tx_id
    eos
    metadata = {}
    exec_tip_results.each do |row|
      post_tx = row[0]
      address_id = row[1]
      tip_total = row[2]
      metadata[post_tx] = {
                              tipped_amount: tip_total,
                              tipped_address: address_id
                          }
    end
    metadata
  end
end