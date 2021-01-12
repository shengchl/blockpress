class NetworkConnection < ActiveRecord::Base
  belongs_to :account

  has_attached_file :image, :styles=> { :tiny => "80x80#", :regular => "160x160#"},
                    :storage => :s3,
                    :s3_credentials => "#{Rails.root}/config/aws.yml",
                    :s3_protocol => "https",
                    :s3_headers => { :cache_control => 30.days.from_now.httpdate },
                    :bucket => Rails.application.config_for(:s3)['general_bucket']

  validates_attachment_content_type :image, :content_type => ['image/jpeg', 'image/pjpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'], :message => "has to be in a proper format"


  def to_s
    "NetworkConnection@#{id} - network: #{network}, uid: #{uid}, connection_ok: #{connection_ok}, connection_last_error: #{connection_last_error}"
  end
end