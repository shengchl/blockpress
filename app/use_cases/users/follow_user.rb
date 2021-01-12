class Users::FollowUser < ActiveInteraction::Base

  integer :follower_id
  integer :following_id

  def execute
    if @follower_id != @following_id
      Follower.find_or_create_by!(:follower_id => @follower_id, :following_id => @following_id)
    end
  end
end


