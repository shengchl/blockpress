class AddCommunityToPosts < ActiveRecord::Migration
  change_table :address_posts do |t|
    t.string :community, limit: 80
  end
  add_index :address_posts, :community
end
