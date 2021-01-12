class CreateAddressLikes < ActiveRecord::Migration
  create_table :address_likes do |t|
    t.string :action_tx, limit: 80, null: false
    t.integer :action_tx_block_id
    t.integer :action_tx_is_mempool

    t.string :liker_address_id, limit: 80, :null => false
    t.string :tip_receiver_address_id, limit: 80, :null => true
    t.string :like_tx, limit: 80,  :null => false
    t.integer :tip_amount, :limit => 8
    t.timestamps
  end

  add_index :address_likes, :action_tx, :unique => true
  add_index :address_likes, :like_tx, :unique => false
  add_index :address_likes, :liker_address_id, :unique => false
  add_index :address_likes, :tip_receiver_address_id, :unique => false
end
