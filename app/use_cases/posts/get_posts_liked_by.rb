require 'bitcoin'

class Posts::GetPostsLikedBy < ActiveInteraction::Base
  string :address

  def execute
    posts_liked = AddressPost.where(:address_id => address, :is_like => 1).all

    post_ids = []
    posts_liked.each do |post_like|
      post_ids << post_like.reply_to_tx_id
    end
    post_ids = post_ids.uniq
    post_returns = []
    posts = AddressPost.where('action_tx in (?)', post_ids).order(:created_at => :desc).all

    metadata = PostMetadataService.get_metadata_for_posts(posts)

    posts.each do |post|
      post_returns.push({
                             actionTx: post.action_tx,
                             messageBody: post.post_body,
                             authorId: post.address_id,
                             likes: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:like_count] : 0,
                             tips: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:tips_total] : 0,
                             replies: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:reply_count] : 0,
                             createdAt: post.post_created_at,
                         })
    end
    post_returns
  end
end


