class PostsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_user, only: [:create_post, :create_like, :create_reply, :get_notifications]
  # caches_action :feed, expires_in: 5.seconds

  def profile_posts
    render json: []
  end

  def create_post

    if params[:communityName].blank?
      result = Posts::CreatePost.run!(:media_payload => params[:imageUrlOrIpfs], :user_id => current_user.id, :body => params[:body])
    else
      result = Posts::CreatePostCommunity.run!(:media_payload => params[:imageUrlOrIpfs], :community_name => params[:communityName], :user_id => current_user.id, :body => params[:body])
    end

    render json: result

  rescue NoUtxoAvailableException => e
      render json: {
          success: false,
          code: 'NO_UTXO',
          message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
      }, status: 400
  end

  def repost_post
    render json: []
  end

  def create_like
    user = User.find_by_username(current_user.username)
    tip_amount = params[:tip]
    if !tip_amount.blank? && tip_amount.to_i > 0
      if tip_amount.to_i > 5000000
        render json: {
            success: false,
            code: 'INVALID_TIP_AMOUNT',
            message: 'Tip amount is too large. Please try a lower amount.'
        }, status: 422
        return
      end
      result = Posts::CreateLike.run!(:user_id => current_user.id,
                                      :tx_id => params[:tx_id],
                                      :body => params[:body],
                                      :tip => tip_amount
      )
      render json: result
      return
    end

    raise 'Fatal' if !tip_amount.blank? && tip_amount.to_i > 0

    result = Posts::CreateLike.run!(:user_id => current_user.id,
                                     :tx_id => params[:tx_id],
                                     :body => params[:body])
    render json: result

  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def photos
    render json: []
  end

  def attach_photo
    render json: []
  end

  def feed
    current_user_address_id = nil
    if user_signed_in?
      current_user_address_id = current_user.address_cash
    end
    posts = Posts::GetPosts.run!(offset_id: params[:offset_id].to_i,
                                 current_user_address_id: current_user_address_id)
    render json:  posts
  end

  def top
    posts = Posts::GetPostsTop.run!(offset_id: params[:offset_id].to_i, range: params[:range])
    render json:  posts
  end

  def profile_posts

    current_user_address_id = nil
    if user_signed_in?
      current_user_address_id = current_user.address_cash
    end

    posts = Posts::GetPosts.run!(address: params[:address_id], current_user_address_id: current_user_address_id)
    render json:  posts
  end

  def get_replies
    if user_signed_in?
      address_cash = current_user.address_cash
      notes = Posts::GetPostReplies.run!(reply_to_tx_id: params[:tx_id])
      render json:  notes
      return
    end
    render json:  {}, status: 403
  end

  def get_notifications
    if user_signed_in?
      address_cash = current_user.address_cash
      notes = Posts::GetNotifications.run!(address: address_cash, offset_id: params[:offset_id], current_user_address_id: address_cash)
      render json:  notes
      return
    end
    render json:  {}, status: 403
  end

  def search
    posts = Posts::GetSearchPostsHashtag.run!(hashtag: params[:hashtag], offset_id: params[:offset_id].to_i)
    render json:  posts
  end

  def get_reply_feed
    if user_signed_in?
      address_cash = current_user.address_cash
      posts = Posts::GetReplyFeed.run!(address_id: address_cash, offset_id: params[:offset_id])
      render json:  posts
      return
    end
    render json:  {}, status: 403
  end

  def create_reply
    result = Posts::CreateReply.run!(:user_id => current_user.id,
                                     :tx_id => params[:tx_id],
                                     :body => params[:body],
                                     :tip => params[:tip])
    render json: result

  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def get_communities
    communities = Posts::GetCommunities.run!(name: params[:name], offset_id: params[:offset_id])
    render json:  communities
  end

  def get_community_posts
    posts = Posts::GetCommunityPosts.run!(community_name: params[:q], offset_id: params[:offset_id].to_i)
    render json:  posts
  end

  def single_post
    current_user_address_id = nil
    if user_signed_in?
      current_user_address_id = current_user.address_cash
    end
    post = Posts::GetPostByTxId.run!(tx_id: params[:tx_id], depth: true, current_user_address_id: current_user_address_id)
    render json:  post
  end

  private
  def set_user
    begin
      raise 'unauthorized' if current_user.blank?
    rescue ActiveRecord::RecordNotFound => e
      render json: {}, status: 401
    end
  end

end
