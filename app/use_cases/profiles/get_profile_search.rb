
class Profiles::GetProfileSearch < ActiveInteraction::Base

  string :offset_id, default: '0'
  string :count, default: '20000'

  def execute
    int_offset = offset_id.to_i
    int_count = count.to_i


    query = "SELECT
    address_idents.address_id as profile_address_id, address_idents.name as profile_name, avatar as profile_avatar, header as profile_header, count(address_followings.following_address_id) as followerCount
    from address_followings, address_idents
    WHERE address_followings.following_address_id = address_idents.address_id
    AND address_idents.name IS NOT NULL
    GROUP BY address_id
    ORDER BY followerCount DESC, profile_avatar DESC, profile_header DESC"

    old = "SELECT count(address_following.following_address_id) as followerCount from address_following, address_idents WHERE address_following.following_address_id = address_idents.address_id ORDER BY address_idents.name DESC, followerCount DESC"
    results = ActiveRecord::Base.connection.execute(query)

    mini_profiles = []
    counter = 0
    results.each do |row|

      if int_count < 20 && row[0] == 'qz2dzedt4vgnumrzf6kpwlkgxnuq5vqncqnuq2zpgc'
        next
      end
        mini_profiles << {
            addressId: row[0],
            name: row[1],
            avatar: row[2],
            header: row[3],
            followers: row[4]
        }
      counter = counter + 1
      if counter > int_count
        break
      end
    end

    mini_profiles
  end
end


