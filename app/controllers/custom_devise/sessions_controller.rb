class CustomDevise::SessionsController < Devise::SessionsController
  layout 'registrations'

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end
  def after_sign_in_path_for(resource)
    session[:password_guess_attempts] = 0
    if (Rails.env.production?)
      'http://www.blockpress.com'
    else
      'http://localhost:4200'
    end
  end

  def after_sign_out_path_for(resource)
    if (Rails.env.production?)
      'http://www.blockpress.com'
    else
      'http://localhost:4200'
    end
  end
end