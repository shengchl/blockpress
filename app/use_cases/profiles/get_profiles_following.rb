
class Profiles::GetProfilesFollowing < ActiveInteraction::Base

  string :address_id

  def execute
    address_ident = AddressIdent.find_by_address_id(address_id)
    return [] unless !address_ident.nil?

    follow_relns = AddressFollowing.where(follower_address_id: address_ident.address_id, deleted: 0).all

    followingids = []
    follow_relns.each do |reln|
      followingids.push reln.following_address_id
    end
    profiles = AddressIdent.where('address_id in (?)', followingids).all
    profiles
  end
end


