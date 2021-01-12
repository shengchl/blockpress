class Users::GetUserByUsername < ActiveInteraction::Base

  string :username

  def execute
    User.where(username: @username).first
  end
end


