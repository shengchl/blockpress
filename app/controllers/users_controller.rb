class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  # before_action :set_user, only: [:show, :edit, :update, :setup, :setup_site, :signed_in]
  caches_action :address_info, expires_in: 1.hour
  caches_action :profile_info, expires_in: 1.hour

  def index
    redirect_to '/users/sign_up'
  end

  def sessions
    if user_signed_in?
      render json: {:userId => current_user.id,
                    :username => current_user.username,
                    :addressLegacy => current_user.address_legacy,
                    :badgeCount => current_user.badge_count,
                    :addressCash => current_user.address_cash.gsub('bitcoincash:', ''),
                    :following => Profiles::GetProfilesFollowing.run!(:address_id => current_user.address_cash),
                    :balances => Wallets::GetBalances.run!(:address_id => current_user.address_cash)
      }
    else
      render json: {:userId => nil}
    end
  end

  def export_key
    if user_signed_in?
      user = User.find_by_username(current_user.username)
      if user.valid_password?(params[:password])
        phrase = user.wallet_phrase ? user.wallet_phrase : nil
        render json: {
            :success => true,
            :wif => user.wif,
            :phrase => phrase
        }
      else

        render json: {
            :success => false, :message => 'Invalid password', :errorCode => :invalid_password
        }
      end
    else
      render json: {:success => false, :message => 'Invalid'}, status: 401
    end
  end

  def logout
    sign_out
    reset_session
    if (Rails.env.production?)
      redirect_to 'http://www.blockpress.com'
    else
      redirect_to 'http://localhost:4200'
    end
    return
  end

  # PATCH/PUT /users/:id.:format
  def update
    return
    # authorize! :update, @user
    respond_to do |format|
      if @user.update(user_params)
        sign_in(@user == current_user ? @user : current_user, :bypass => true)
        format.html { redirect_to @user, notice: 'Your profile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  def set_user
    begin
      @user = User.find(params[:id])

      if @user.id != current_user.id
        redirect_to root_path
      end
    rescue ActiveRecord::RecordNotFound => e
      redirect_to root_path
    end

  end

  def update_password
    return
    @user = current_user
    if @user.update(user_params)
      # Sign in the user by passing validation in case their password changed
      bypass_sign_in(@user)
      redirect_to root_path
    else
      render "edit"
    end
  end

  def user_params
    accessible = [:name, :username, :password] # extend with your own params
    accessible << [:password, :password_confirmation] unless params[:user][:password].blank?
    params.require(:user).permit(accessible)
  end
end
