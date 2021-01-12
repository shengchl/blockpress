class AddMediaTypesToPosts < ActiveRecord::Migration
  change_table :address_posts do |t|
    t.integer :media_type
    t.string :media_payload
    t.integer :sequence
  end
  add_index :address_posts, :media_type
  add_index :address_posts, :sequence
end
