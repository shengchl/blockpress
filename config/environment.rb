# Load the Rails application.
require File.expand_path('../application', __FILE__)

HOSTS_CONFIG = YAML.load_file("#{::Rails.root}/config/hosts.yml")[::Rails.env]

Rails.configuration.hosts = {
    :domain_name =>  HOSTS_CONFIG['domain_name']
}

STRIPE_CONFIG = YAML.load_file("#{::Rails.root}/config/stripe.yml")[::Rails.env]

Rails.configuration.stripe = {
    :secret_key =>  STRIPE_CONFIG['secret_key'],
    :publishable_key =>  STRIPE_CONFIG['publishable_key']
}

S3_CONFIG = YAML.load_file("#{::Rails.root}/config/s3.yml")[::Rails.env]

Rails.configuration.s3 = {
    :general_bucket =>  S3_CONFIG['general_bucket'],
    :asset_host =>  S3_CONFIG['asset_host']
}

AWS_CONFIG = YAML.load_file("#{::Rails.root}/config/aws.yml")[::Rails.env]

Rails.configuration.aws = {
    :access_key_id =>  AWS_CONFIG['access_key_id'],
    :secret_access_key => AWS_CONFIG['secret_access_key']
}

OAUTH_CONFIG = YAML.load_file("#{::Rails.root}/config/oauth.yml")[::Rails.env]

Rails.configuration.oauth = {
    :facebook_app_id =>  OAUTH_CONFIG['facebook_app_id'],
    :facebook_app_key => OAUTH_CONFIG['facebook_app_key'],
    :twitter_app_id =>  OAUTH_CONFIG['twitter_app_id'],
    :twitter_app_key => OAUTH_CONFIG['twitter_app_key']
}

MAILCHIMP_CONFIG = YAML.load_file("#{::Rails.root}/config/mailchimp.yml")[::Rails.env]

Rails.configuration.mailchimp = {
    :api_key =>  MAILCHIMP_CONFIG['api_key'],
    :list_id =>  MAILCHIMP_CONFIG['list_id'],
}

CDN_CONFIG = YAML.load_file("#{::Rails.root}/config/cdn.yml")[::Rails.env]

Rails.configuration.cdn = {
    :cdn_base =>  CDN_CONFIG['cdn_base'],
    :asset_base =>  CDN_CONFIG['asset_base']
}

EMAIL_CONFIG = YAML.load_file("#{::Rails.root}/config/email.yml")[::Rails.env]

Rails.configuration.email = {
    :address =>  EMAIL_CONFIG['address'],
    :address_port =>  EMAIL_CONFIG['address_port'],
    :user_name => EMAIL_CONFIG['user_name'],
    :password => EMAIL_CONFIG['password'],
    :domain => EMAIL_CONFIG['domain'],
    :from_name => EMAIL_CONFIG['from_name'],
    :from_email => EMAIL_CONFIG['from_email'],
    :service_email => EMAIL_CONFIG['service_email'],
    :reply_to_email => EMAIL_CONFIG['reply_to_email']
}

DOMAIN_CONFIG = YAML.load_file("#{::Rails.root}/config/domain.yml")[::Rails.env]

Rails.configuration.domain = {
    :tld =>  DOMAIN_CONFIG['tld']
}

APP_CONFIG = YAML.load_file("#{::Rails.root}/config/app.yml")[::Rails.env]

Rails.configuration.app = {
    :utxo_endpoint_url => APP_CONFIG['utxo_endpoint_url'],
    :broadcaster_endpoint_url => APP_CONFIG['broadcaster_endpoint_url'],
    :block_syncer_url => APP_CONFIG['block_syncer_url'],
}

# Initialize the Rails application.
Rails.application.initialize!