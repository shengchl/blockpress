class CreateAddressImages < ActiveRecord::Migration
  create_table :address_images do |t|
    t.string :action_tx, :limit => 70
    t.integer :action_tx_block_id
    t.integer :action_tx_is_mempool

    t.string :address_id, :null => false, :limit => 50
    t.string :caption, :limit => 217
    t.string :image_link_or_ipfs, :limit => 217

    t.integer :image_created_at
    t.timestamps
  end
  add_index :address_images, :action_tx, :unique => true, :name => 'addy_images_atx_idx'
  add_index :address_images, :address_id, :unique => false, :name => 'addy_images_addyid_idx'
  add_index :address_images, :action_tx_block_id, :unique => false, :name => 'addy_images_blockid_idx'
end
