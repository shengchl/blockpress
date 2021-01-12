# app/mailers/application_mailer.rb
class ApplicationMailer < ActionMailer::Base
  default from: Rails.configuration.email[:from_email]
  layout 'mailer'
end