require 'bitcoin'

class Posts::GetPosts < ActiveInteraction::Base
  string :current_user_address_id, default: nil
  string :address, default: nil
  integer :offset_id, default: 0
  boolean :depth, default: true # Whether to fetch subposts
  integer :count, default: 25

  def execute
    posts = []
    if address.blank?
      if offset_id && offset_id != 0
        posts = AddressPost.where('is_like = ? AND reply_to_tx_id IS NULL', 0).order(:action_tx_block_id => :desc, :created_at => :desc).limit(count).offset(offset_id * count)
      else
        posts = AddressPost.where('is_like = ? AND reply_to_tx_id IS NULL', 0).all.order(:action_tx_block_id => :desc, :created_at => :desc).limit(count)
      end
    else
      if offset_id && offset_id != 0
        posts = AddressPost.where('address_id = ? AND is_like <> 1', address).order(:action_tx_block_id => :desc, :created_at => :desc).limit(count).offset(offset_id * count)
      else
        posts = AddressPost.where('address_id = ? AND is_like <> 1', address).order(:action_tx_block_id => :desc, :created_at => :desc).limit(count)
      end
    end

   Posts::GetPosts.construct_returns(posts, depth, current_user_address_id)
  end

  def self.construct_returns_with_entity_type(posts, depth = true, current_user_address_id = nil)
    post_returns = []
    metadata = PostMetadataService.get_metadata_for_posts(posts)
    posts.each do |post|
      replyToPost = nil
      replyToPost = Posts::GetPostByTxId.run!(tx_id: post.reply_to_tx_id) unless !depth
      post_returns.push({
                        txId: post.action_tx,
                        sequence: post.id,
                        entityType: 'post',
                        entity: {
                            id: post.id,
                            actionTx: post.action_tx,
                            replyToPost: replyToPost,
                            messageBody: post.post_body,
                            mediaType: post.media_type,
                            mediaPayload: post.media_payload ? post.media_payload : nil,
                            isFollowingAuthor: true,
                            authorId: post.address_id,
                            likes: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:like_count] : 0,
                            tips: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:tips_total] : 0,
                            replies: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:reply_count] : 0,
                            createdAt: post.post_created_at,
                            isLike: post.is_like == 1 ? true : false,
                            isLikeTippedAmount: post.tip_amount,
                            isLikeTippedAddress: nil
                        }
                        })
    end
    post_returns
  end

  def self.construct_returns(posts, depth = true, current_user_address_id = nil)
    post_returns = []
    metadata = PostMetadataService.get_metadata_for_posts(posts)
    # like_tip_data = PostMetadataService.get_like_tip_data_for_posts(posts)

    posts.each do |post|
      # tip_data = Posts::GetPostTipData.run!(:action_tx => post.action_tx)
      replyToPost = nil
      replyToPost = Posts::GetPostByTxId.run!(tx_id: post.reply_to_tx_id) unless !depth
      post_returns.push({
                            id: post.id,
                            actionTx: post.action_tx,
                            replyToPost: replyToPost,
                            messageBody: post.post_body,
                            authorId: post.address_id,
                            isFollowingAuthor: true,
                            likes: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:like_count] : 0,
                            tips: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:tips_total] : 0,
                            replies: !metadata[post.action_tx].blank? ? metadata[post.action_tx][:reply_count] : 0,
                            mediaType: post.media_type,
                            mediaPayload: post.media_payload ? post.media_payload : nil,
                            createdAt: post.post_created_at,
                            isLike: post.is_like == 1 ? true : false,
                            isLikeTippedAmount: post.tip_amount,
                            isLikeTippedAddress: nil,
                            community: !post.community.blank? && post.community != '' ? post.community : nil
                        })
    end
    post_returns
  end
end


