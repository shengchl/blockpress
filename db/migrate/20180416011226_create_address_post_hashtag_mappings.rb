class CreateAddressPostHashtagMappings < ActiveRecord::Migration
  create_table :address_post_hashtag_mappings do |t|
    t.string :hashtag, limit: 80, :null => false
    t.string :post_tx_id, limit: 80, :null => false
    t.timestamps
  end
  add_index :address_post_hashtag_mappings, :hashtag, :unique => false
  add_index :address_post_hashtag_mappings, :post_tx_id, :unique => false
  add_index :address_post_hashtag_mappings, [ :hashtag, :post_tx_id ], :unique => true, :name => 'post_tx_hash_idx'
end
