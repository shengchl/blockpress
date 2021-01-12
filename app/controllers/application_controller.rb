class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  before_filter :add_cors_headers

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    attributes = [:username, :password]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:sign_in, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

  # For all responses in this controller, return the CORS access control headers.
  def empty
    render :nothing => true
  end

  def add_cors_headers
    origin = request.headers["Origin"]
    unless (not origin.nil?) and (origin == "http://localhost" or origin.starts_with? "http://localhost:4200")
      origin = 'https://www.blockpress.com'
    end

    if origin == 'https://api.blockpress.com'
      origin = 'https://api.blockpress.com'
    end

    if origin == 'https://www.blockpress.com'
      origin = 'https://www.blockpress.com'
    end

    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE'
    allow_headers = request.headers["Access-Control-Request-Headers"]
    if allow_headers.nil?
      #shouldn't happen, but better be safe
      allow_headers = 'Origin, Authorization, Accept, Content-Type'
    end
    headers['Access-Control-Allow-Headers'] = allow_headers
    headers['Access-Control-Allow-Credentials'] = 'true'
    headers['Access-Control-Max-Age'] = '1728000'
  end
   
  # Include JS setup variables
  def include_js_setup_vars
    gon.is_production = Rails.env.production?
    gon.fqdn = request.host_with_port
    gon.facebook_app_id = Rails.configuration.oauth[:facebook_app_id]
    gon.twitter_app_id = Rails.configuration.oauth[:twitter_app_id]
    @facebook_app_id = gon.facebook_app_id
    @twitter_app_id = gon.twitter_app_id
  end
end
