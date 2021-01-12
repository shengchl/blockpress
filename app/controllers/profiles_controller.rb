class ProfilesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_user, only: [:update_profile_header,
                                  :update_profile_avatar,
                                  :update_profile_name,
                                  :update_profile_follow,
                                  :update_profile_unfollow]

  def likes
    render json: Posts::GetPostsLikedBy.run!(address: params[:address])
  end

  def update_profile_name
    result = Profiles::UpdateProfileName.run!(:user_id => current_user.id, :name => params[:name])
    render json: result
  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def update_profile_avatar
    result = Profiles::UpdateProfileAvatar.run!(:user_id => current_user.id, :ipfsid => params[:link])
    render json: result
  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def update_profile_bio
    render json: []
  end

  def update_profile_header
    result = Profiles::UpdateProfileHeader.run!(:user_id => current_user.id, :ipfsid => params[:link])
    render json: result
  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def profile_info
    user = nil
    profile = nil

    address_ids = params[:address].split(',')

    if user_signed_in?
      user_id = current_user.address_cash
      own_profile_address = current_user.address_cash
      profile = Profiles::GetProfile.run!(:address_ids => address_ids,
                                          :current_user_address => user_id,
                                          :own_profile_address => own_profile_address) || {}
    else
      profile = Profiles::GetProfile.run!(:address_ids => address_ids) || {}
    end
    render json: profile
  end

  def profile_info_deprecated
    user = nil
    profile = nil

    address_ids = params[:address].split(',')

    if user_signed_in?
      user_id = current_user.address_cash
      own_profile_address = current_user.address_cash
      profile = Profiles::GetProfile.run!(:address_ids => address_ids,
                                          :current_user_address => user_id,
                                          :own_profile_address => own_profile_address) || {}
    else
      profile = Profiles::GetProfile.run!(:address_ids => address_ids) || {}
    end
    render json: profile
  end

  def profile_basic_info
    address_ids = params[:address].split(',')
    profiles = Profiles::GetProfileBasic.run!(:address_ids => address_ids) || {}
    render json: profiles
  end

  def profile_follow_user
    result = Profiles::UpdateProfileFollowUser.run!(:user_id => current_user.id, :address => params[:address])
    render json: result

  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def profile_unfollow_user
    result = Profiles::UpdateProfileUnfollowUser.run!(:user_id => current_user.id, :address => params[:address])
    render json: result

  rescue NoUtxoAvailableException => e
    render json: {
        success: false,
        code: 'NO_UTXO',
        message: 'Insufficient confirmed balance. Please deposit a small amount of funds and try again.'
    }, status: 400
  end

  def followers
    profiles = Profiles::GetProfileFollowers.run!(:address_id => params[:address]) || {}
    render json: profiles
  end


  def profile_search
    profiles = Profiles::GetProfileSearch.run!(:offset_id => params[:offsetId], :count => params[:count])
    render json: profiles
  end

  def profile_active
    profiles = Profiles::GetProfilesActive.run!
    render json: profiles
  end
  def following
    profiles = Profiles::GetProfilesFollowing.run!(:address_id => params[:address]) || {}
    render json: profiles
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
