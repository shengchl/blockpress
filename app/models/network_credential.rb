class NetworkCredential < ActiveRecord::Base
  belongs_to :account
  has_many :stream_source
end