require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
require 'carrierwave'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Sitely
  class Application < Rails::Application

    expected_origin = 'https://www.blockpress.com'
    if !Rails.env.production?
      expected_origin = 'http://localhost:4200'
    end
    # headers['Access-Control-Allow-Origin'] = origin

    #http://stackoverflow.com/questions/17858178/allow-anything-through-cors-policy
    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins [expected_origin]
        resource '*', :headers => :any, :methods => [:get, :post, :options, :delete], :credentials => true
      end
    end
    config.cache_store = :memory_store, { size: 64.megabytes }
    #http://kennethjiang.blogspot.ca/2014/07/set-up-cors-in-cloudfront-for-custom.html
    # config.font_assets.origin = "*"

    config.autoload_paths += %W(#{config.root}/app/processors #{config.root}/app/use_cases #{config.root}/app/services #{config.root}/app/uploaders  )

    config.generators do |g|
      g.test_framework :rspec,
        fixtures: true,
        view_specs: false,
        helper_specs: false,
        routing_specs: false,
        controller_specs: false,
        request_specs: false
      g.fixture_replacement :factory_girl, dir: "spec/factories"
    end

    config.assets.paths << Rails.root.join("lib", "vendor")
    config.assets.paths << Rails.root.join("app", "assets", "fonts")

    config.active_record.raise_in_transactional_callbacks = true



    #config.assets.paths += ["#{config.root}/vendor/assets/fonts", "#config.root}/app/assets/images/**", "#{config.root}/vendor/assets/images"]
   # config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif *.eot *.svg *.ttf *.otf *.woff vendor/assets/stylesheets/**/* vendor/assets/fonts/*)

   # ["#{config.root}/vendor/assets/javascripts", "#config.root}/vendor/assets/stylesheets"].each do |d|
   # config.assets.precompile += Dir.glob("#{d}/*").map{|f| "#{f.gsub(d + '/', '')}/**/*" if File.directory?(f)}.compact

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
  end
end
