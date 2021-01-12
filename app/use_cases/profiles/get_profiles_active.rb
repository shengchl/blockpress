
class Profiles::GetProfilesActive < ActiveInteraction::Base
  def execute
    last_while = (Time.now - 4.hours).to_i
    query_result = ActiveRecord::Base.connection.execute <<-eos.squish
      SELECT address_idents.address_id, address_idents.name, address_idents.avatar, address_idents.header, count(address_posts.id) as total_posts
      FROM
      address_idents, address_posts
      WHERE
      address_idents.address_id = address_posts.address_id
      AND
      address_posts.post_created_at > "#{last_while}"
      AND
      address_idents.name IS NOT NULL
      GROUP BY address_idents.address_id
      ORDER BY total_posts DESC, post_created_at DESC
      LIMIT 10
    eos
    mini_profiles = []
    query_result.each do |row|
      mini_profiles << {
          addressId: row[0],
          name: row[1],
          avatar: row[2],
          header: row[3],
      }
    end
    mini_profiles
  end
end


