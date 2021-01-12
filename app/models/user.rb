class User < ActiveRecord::Base
  has_many :account, :through => :account_manager
  has_many :account_manager
  has_many :identity
  devise :database_authenticatable,
         :rememberable,
         :trackable,
         :validatable,
         :registerable,
         :authentication_keys => [:username]

  validates :username, presence: :true, uniqueness: { case_sensitive: false }
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, :multiline => true

  protected


  def email_required?
    false
  end

  def email_changed?
    false
  end
end

