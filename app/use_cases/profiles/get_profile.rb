require 'bitcoin'

class Profiles::GetProfile < ActiveInteraction::Base

  array :address_ids
  string :current_user_address, default: nil
  string :own_profile_address, default: nil

  def execute
    profiles = []
    address_ids.uniq.each do |address_id|
      profile = AddressIdent.find_by_address_id(address_id)

      raise 'Profile not found' unless !profile.nil?

      followers = Profiles::GetProfileFollowers.run!(address_id: address_id).size
      following = Profiles::GetProfilesFollowing.run!(address_id: address_id).size
      posts = AddressPost.where('address_id = ? AND is_like = ?', address_id, 0).all.count
      likes = AddressPost.where(:address_id => address_id, :is_like => 1).all
      f = []
      likes.each do | foo|
        f << foo.reply_to_tx_id
      end
      likes = f.uniq()
      like_count = likes.size

      current_user_following = nil
      if !current_user_address.blank?
        current_user_following = AddressFollowing.where(:follower_address_id => current_user_address, :following_address_id => profile.address_id).first
      end

      like_txs = {
      }

      profile_mempool_status = {

      }

      if address_id == own_profile_address
        like_action_posts = AddressPost.where(:address_id => current_user_address, :is_like => 1)
        like_action_posts.each do |like_action_post|
          next if like_action_post.reply_to_tx_id.blank?
          like_txs[like_action_post.reply_to_tx_id] = like_action_post.reply_to_tx_id
        end
      end

      profile_mempool_status = {
          isNameMempool: profile.set_profile_name_is_mempool,
          nameTx: profile.set_profile_name_tx,
          isAvatarMempool: profile.set_profile_avatar_is_mempool,
          avatarTx: profile.set_profile_avatar_tx,
          isHeaderMempool: profile.set_profile_header_is_mempool,
          headerTx: profile.set_profile_header_tx,
      }

      profiles << {
          followers: followers,
          following: following,
          posts: posts,
          name: profile.nil? ? address_id : profile.name,
          address_id: address_id,
          avatar: profile.avatar,
          bio: profile.bio,
          likes: like_count,
          tips: AddressPost.where(tip_address_id: address_id).sum(:tip_amount),
          currentUserFollowing: current_user_following && current_user_following.deleted == 0 ? true : false,
          currentUserFollowingMempool: current_user_following && current_user_following.action_tx_is_mempool == 1 ? true : false,
          currentUserFollowingTx: current_user_following && current_user_following.action_tx_is_mempool ? current_user_following.action_tx : nil,
          likeTxs: like_txs,
          header: profile.header
      }.merge(profile_mempool_status)
    end
    profiles
  end
end


