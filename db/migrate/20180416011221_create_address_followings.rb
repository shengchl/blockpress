class CreateAddressFollowings < ActiveRecord::Migration
  create_table :address_followings do |t|
    t.string :action_tx, limit: 80, :null => false
    t.integer :action_tx_block_id
    t.integer :action_tx_is_mempool

    t.string :follower_address_id, limit: 80, :null => false
    t.string :following_address_id, limit: 80, :null => false
    t.integer :deleted, :null => false # Removed followers are tombstoned
    t.timestamps
  end

  add_index :address_followings, :action_tx, :unique => true
  add_index :address_followings, :follower_address_id, :unique => false
  add_index :address_followings, :following_address_id, :unique => false
  add_index :address_followings, [ :follower_address_id, :following_address_id ], :unique => false, :name => :follower_address_idx
  add_index :address_followings, :deleted
end
