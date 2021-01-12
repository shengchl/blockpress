class CreateMempoolUtxoByAddress < ActiveRecord::Migration
  create_table :mempool_utxo_by_address do |t|
    t.string :address, limit: 80, :null => false
    t.string :txhash, limit: 80, :null => false
    t.string :script_hex, :null => false
    t.integer :output_number, :null => false
    t.text :obj_tx
    t.integer :value, :null => false, :limit => 8
    t.integer :descendants
    t.integer :fee_value # value of inputs minus output is the fee
    t.timestamps
  end
  add_index :mempool_utxo_by_address, :txhash, :name => 'mempool_tx_txhash'
  add_index :mempool_utxo_by_address, :address, :name => 'mempool_tx_address'
  add_index :mempool_utxo_by_address, [ :address, :txhash, :output_number ], :unique => true, :name => 'mempool_tx_compound'
end
