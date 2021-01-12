def create_user_account_and_login
  @user = FactoryGirl.create(:user)
  @user.should be_valid

  @account = FactoryGirl.create(:account)
  @account.should be_valid

  account_manager = FactoryGirl.create(:account_manager, :account => @account, :user => @user)
  account_manager.should be_valid

  login_as(@user, :scope => :user)
end

def create_user_account
  @user = FactoryGirl.create(:user)
  @user.should be_valid

  @account = FactoryGirl.create(:account)
  @account.should be_valid

  account_manager = FactoryGirl.create(:account_manager, :account => @account, :user => @user)
  account_manager.should be_valid

end

def create_user
  @user = FactoryGirl.create(:user)
  @user.should be_valid
end
