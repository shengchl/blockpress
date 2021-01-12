require 'bitcoin'

class Posts::GetCommunityPosts < ActiveInteraction::Base
  string :community_name
  integer :offset_id, default: 0
  boolean :depth, default: true # Whether to fetch subposts
  integer :count, default: 25


  def execute
    posts = []
    if offset_id && offset_id != 0
      posts = AddressPost.where('community = ? AND is_like = ? AND reply_to_tx_id IS NULL', community_name, 0).order(:action_tx_block_id => :desc, :created_at => :desc).limit(count).offset(offset_id * count)
    else
      posts = AddressPost.where('community = ? AND is_like = ? AND reply_to_tx_id IS NULL', community_name, 0).all.order(:action_tx_block_id => :desc, :created_at => :desc).limit(count).offset(offset_id * count)
    end

   Posts::GetPosts.construct_returns(posts, depth)
  end
end


