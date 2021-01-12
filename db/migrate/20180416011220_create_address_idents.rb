class CreateAddressIdents < ActiveRecord::Migration
  create_table :address_idents do |t|
    t.string :address_id, :limit => 50, :null => false
    t.string :name, :limit => 76
    t.string :set_profile_name_tx
    t.integer :set_profile_name_block_id
    t.integer :set_profile_name_is_mempool

    t.string :bio, :limit => 220
    t.string :set_profile_bio_tx
    t.integer :set_profile_bio_block_id
    t.integer :set_profile_bio_is_mempool

    t.string :avatar
    t.string :set_profile_avatar_tx
    t.integer :set_profile_avatar_block_id
    t.integer :set_profile_avatar_is_mempool

    t.string :header
    t.string :set_profile_header_tx
    t.integer :set_profile_header_block_id
    t.integer :set_profile_header_is_mempool

    t.timestamps
  end
  add_index :address_idents, :address_id, :unique => true, :name => 'ident_addy_idx'
  add_index :address_idents, :name, :unique => false, :name => 'ident_name_idx'
end
