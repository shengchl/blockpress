
module GetHostnameHelper

  # Gets the base URL the server is running at
  def get_base_url

    if Rails.env.production?
      request.protocol + request.host
    else
      request.protocol + request.host_with_port
    end

  end

  def get_cdn_base_url
  	Rails.configuration.cdn[:cdn_base]
  end

end