
class Profiles::GetProfileFollowers < ActiveInteraction::Base

  string :address_id

  def execute
    address_ident = AddressIdent.find_by_address_id(address_id)
    return [] unless !address_ident.nil?

    follow_relns = AddressFollowing.where(following_address_id: address_ident.address_id, deleted: 0).all

    profile_ids = []
    follow_relns.each do |reln|
      profile_ids.push reln.follower_address_id
    end
    profiles = AddressIdent.where('address_id in (?)', profile_ids).all
    profiles
  end
end


