class CreateAddressPostReposts < ActiveRecord::Migration
  create_table :address_post_reposts do |t|
    t.string :originating_tx, limit: 80, :null => false
    t.string :repost_tx_id, limit: 80, :null => false
    t.string :reposted_post_tx_id, limit: 80, :null => false
    t.string :address_id, limit: 80, :null => false
    t.integer :repost_created_at
    t.integer :block_id_synced
    t.timestamps
  end
  add_index :address_post_reposts, :repost_tx_id, :unique => true
  add_index :address_post_reposts, :reposted_post_tx_id, :unique => false
  add_index :address_post_reposts, :address_id, :unique => false
end
