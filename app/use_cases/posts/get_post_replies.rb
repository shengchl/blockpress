require 'bitcoin'

class Posts::GetPostReplies < ActiveInteraction::Base
  string :reply_to_tx_id

  def execute
    posts = AddressPost.where('reply_to_tx_id = ?', reply_to_tx_id).order(:created_at => :asc).limit(200)
    Posts::GetPosts.construct_returns(posts, false)
  end
end


