class CreateUnspentUtxos < ActiveRecord::Migration
  create_table :unspent_utxos do |t|
    t.string :address, limit: 80, :null => false
    t.text :raw_data, :null => false
    t.timestamps
  end
  add_index :unspent_utxos, :address, :unique => true
end
