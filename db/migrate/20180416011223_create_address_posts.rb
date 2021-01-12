class CreateAddressPosts < ActiveRecord::Migration
  create_table :address_posts do |t|
    t.string :action_tx, :limit => 70
    t.integer :action_tx_block_id
    t.integer :action_tx_is_mempool

    t.string :address_id, :null => false, :limit => 50
    t.string :post_body, :limit => 220
    t.string :post_image_ipfs

    t.string :reply_to_tx_id, limit: 70, :null => true

    t.integer :is_like, :null => false, :default => 0
    t.integer :post_created_at
    t.timestamps
  end
  add_index :address_posts, :is_like, :name => 'addy_posts_is_like_atx_idx'
  add_index :address_posts, :action_tx, :unique => true, :name => 'addy_posts_atx_idx'
  add_index :address_posts, :reply_to_tx_id, :unique => false, :name => 'addy_repl_posts_atx_idx'
  add_index :address_posts, :address_id, :unique => false, :name => 'addy_posts_addyid_idx'
  add_index :address_posts, :action_tx_block_id, :unique => false, :name => 'addy_posts_blockid_idx'
end
