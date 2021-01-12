
module UserHelper
  def setup_user(user)
    user.account ||= Account.new
    user
  end
end