class Follower < ActiveRecord::Base
  belongs_to :user, :class_name => 'User', :foreign_key => 'following_id'
  has_one :user, :class_name => 'User', :foreign_key => 'follower_id'

end