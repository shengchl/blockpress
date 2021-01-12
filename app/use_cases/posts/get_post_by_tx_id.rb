require 'bitcoin'

class Posts::GetPostByTxId < ActiveInteraction::Base
  string :tx_id, default: nil
  boolean :depth, default: false
  string :current_user_address_id, default: nil

  def execute
    return nil if @tx_id.blank?
    posts = AddressPost.where('action_tx = ?', @tx_id)
    return_posts = Posts::GetPosts.construct_returns(posts, depth, current_user_address_id)
    return_posts.first
  end
end


