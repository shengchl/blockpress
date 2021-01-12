require 'bitcoin'

class Posts::GetNotifications < ActiveInteraction::Base
  string :address
  integer :offset_id, default: 0
  boolean :depth, default: true

  def execute
    # Get all users that you are following
    following = AddressFollowing.where(:follower_address_id => address)
    # Get all their posts, sorted by appearance in mempool
    posts = []
    following.each_slice(500) do |slice|

      slice_ids = []
      slice.each do |s|
        slice_ids << s.following_address_id
      end
      slice_ids = slice_ids.uniq

      if offset_id == 0
        post_slice = AddressPost.where('address_id in (?) AND is_like = ?', slice_ids, 0).order(:action_tx_block_id => :desc, :created_at => :desc).limit(35)
      else
        post_slice = AddressPost.where('id < ? AND address_id in (?) AND is_like = ?', offset_id, slice_ids, 0).order(:action_tx_block_id => :desc, :created_at => :desc).limit(35)
      end

      post_slice.each do |single|
          posts << single
      end
    end

    Posts::GetPosts.construct_returns_with_entity_type(posts, true)
  end
end


