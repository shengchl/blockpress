class CreateSyncStats < ActiveRecord::Migration
  create_table :sync_stats do |t|
    t.string :next_block_to_sync, :null => false
    t.string :last_block_sync_status, :null => false
    t.timestamps
  end
end
