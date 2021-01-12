require 'bitcoin'

class Profiles::GetProfileBasic < ActiveInteraction::Base

  array :address_ids

  def execute
    profiles = []
    address_ids.uniq.each do |address_id|
      profile = AddressIdent.find_by_address_id(address_id)
      next if profile.nil?

      profiles << {
          name: profile.nil? ? address_id : profile.name,
          address_id: address_id,
          avatar: profile.avatar,
          bio: profile.bio,
          header: profile.header
      }
    end
    profiles
  end
end


