# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store, key: '_bpx_sessions',domain: {
    production: 'api.blockpress.com',
    development: '.lvh.me'
}.fetch(Rails.env.to_sym, :all)
