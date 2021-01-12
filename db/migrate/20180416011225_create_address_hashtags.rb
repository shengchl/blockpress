class CreateAddressHashtags < ActiveRecord::Migration
  create_table :address_hashtags do |t|
    t.string :hashtag, limit: 80, :null => false
    t.timestamps
  end
  add_index :address_hashtags, :hashtag, :unique => true
end
