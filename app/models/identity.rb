class Identity < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

  has_attached_file :image, :styles=> { :t => "130x130#", :s => "<400"},
                    :storage => :s3,
                    :s3_credentials => "#{Rails.root}/config/aws.yml",
                    :s3_protocol => "https",
                    :s3_headers => { :cache_control => 30.days.from_now.httpdate },
                    :bucket => Rails.application.config_for(:s3)['general_bucket']

  validates_attachment_content_type :image, :content_type => ['image/jpeg', 'image/pjpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'], :message => "has to be in a proper format"


  def self.find_for_oauth(uid, provider, token, secret, username)
    result = find_or_create_by(uid: uid, provider: provider)
    result.token = token
    result.secret = secret
    result.user_name = username
    result.save!
    result
  end
end