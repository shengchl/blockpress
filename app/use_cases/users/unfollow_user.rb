class Users::UnfollowUser < ActiveInteraction::Base

  integer :follower_id
  integer :following_id

  def execute
    if @follower_id != @following_id
      following_relationship = Follower.where(:follower_id => @follower_id, :following_id => @following_id)
      Follower.destroy(following_relationship.first.id) unless following_relationship.first.blank?
    end
  end
end


