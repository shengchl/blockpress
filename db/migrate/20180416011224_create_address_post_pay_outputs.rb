class CreateAddressPostPayOutputs < ActiveRecord::Migration
  create_table :address_post_pay_outputs do |t|
    t.string :action_tx, :limit => 70, :null => false

    t.string :output_address_id, :null => false, :limit => 50
    t.integer :output_value, :null => false
    t.integer :output_number, :null => false
    t.timestamps
  end

  add_index :address_post_pay_outputs, :action_tx, :unique => false, :name => 'addy_posts_po_atx_idx'
  add_index :address_post_pay_outputs, :output_value, :unique => false, :name => 'addy_posts_po_ov_idx'
  add_index :address_post_pay_outputs, :output_address_id, :unique => false, :name => 'addy_posts_po_oai_idx'
end
