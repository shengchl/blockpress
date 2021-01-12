Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.
  config.action_controller.perform_caching = true
  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  config.assets.compress = false
  #config.assets.js_compressor = :uglifier
  #config.assets.js_compressor = NoCompression.new
  #config.assets.js_compressor = Uglifier.new(:harmony => true, :mangle => { :eval => true, :toplevel => true }, :output => { :comments => :copyright })
  #config.assets.prefix = "/pjs_renderer"

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = false # Turn on to seperate files

  config.action_dispatch.default_headers = {
      'X-Frame-Options' => 'ALLOWALL'
  }

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true


  # General Settings
  config.app_domain = 'lvh.me'

  # ActionMailer Config
  # Setup for production - deliveries, no errors raised
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default :charset => "utf-8"
  config.action_mailer.default_url_options = { :host => Rails.configuration.domain[:tld] }
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    :port => "25",
    :authentication => :plain,
    :user_name => Rails.configuration.email[:user_name],
    :password => Rails.configuration.email[:password],
    :domain => Rails.configuration.email[:address],
    :address => Rails.configuration.email[:domain]
  }


end
