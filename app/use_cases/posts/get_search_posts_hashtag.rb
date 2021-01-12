require 'bitcoin'

class Posts::GetSearchPostsHashtag < ActiveInteraction::Base
  string :hashtag, default: ''
  integer :offset_id, default: 0
  boolean :depth, default: true # Whether to fetch subposts
  integer :count, default: 100

  def execute

    return [] if hashtag.blank?

    if offset_id && offset_id > 0
      posts = AddressPost.joins("INNER JOIN address_post_hashtag_mappings ON address_posts.action_tx = address_post_hashtag_mappings.post_tx_id AND address_post_hashtag_mappings.hashtag = '#{hashtag}' AND address_posts.id < #{offset_id}").order(:created_at => :desc).limit(count)
    else
      posts = AddressPost.joins("INNER JOIN address_post_hashtag_mappings ON address_posts.action_tx = address_post_hashtag_mappings.post_tx_id AND address_post_hashtag_mappings.hashtag = '#{hashtag}'").order(:created_at => :desc).limit(count)
    end

   Posts::GetPosts.construct_returns(posts, depth)
  end
end


