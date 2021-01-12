class Account < ActiveRecord::Base
  has_many :user, :through => :account_manager
  has_many :account_manager
  has_many :stream
  has_many :network_connection
  has_many :network_credential
  has_many :stream_source

  def managed_by?(user)
    AccountManager.where(:account_id => self.id, :user_id => user.id).first != nil
  end

  def has_valid_twitter_connection?
    false
  end
end