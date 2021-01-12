class CreateVins < ActiveRecord::Migration
  create_table :vins do |t|
    t.string :parent_tx, :null => false
    t.string :vin_tx, :null => false
    t.text :vin_blob, :null => false
    t.timestamps
  end
end
