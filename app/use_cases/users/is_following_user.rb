class Users::IsFollowingUser < ActiveInteraction::Base

  integer :follower_id
  integer :following_id

  def execute
    if @follower_id != @following_id
      following_relationship = Follower.where(:follower_id => @follower_id, :following_id => @following_id)
      return !following_relationship.first.blank?
    end
  end
end


