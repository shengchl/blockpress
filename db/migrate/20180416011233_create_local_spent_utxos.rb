class CreateLocalSpentUtxos < ActiveRecord::Migration
  create_table :local_spent_utxos do |t|
    t.string :address, limit: 80, :null => false
    t.string :txhash, limit: 80, :null => false
    t.integer :output_number, :null => false
    t.timestamps
  end
  add_index :local_spent_utxos, :address
  add_index :local_spent_utxos, :txhash
  add_index :local_spent_utxos, :output_number
end
