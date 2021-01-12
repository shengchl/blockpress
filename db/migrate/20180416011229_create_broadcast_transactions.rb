class CreateBroadcastTransactions < ActiveRecord::Migration
  create_table :broadcast_transactions do |t|
    t.string :txhash, limit: 80, :null => false
    t.text :raw_tx, :null => false
    t.text :obj_tx, :null => false
    t.integer :is_success
    t.integer :attempt_count
    t.string :last_attempt_error
    t.integer :last_attempted_at
    t.timestamps
  end
  add_index :broadcast_transactions, :txhash, :unique => true
  add_index :broadcast_transactions, :is_success
  add_index :broadcast_transactions, :attempt_count
  add_index :broadcast_transactions, :last_attempted_at
end
