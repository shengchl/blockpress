class CreateNetworkConnections < ActiveRecord::Migration
  def change
    create_table :network_connections do |t|
      t.string :network, :null => false
      t.string :uid, :null => false
      t.attachment :image
      t.string :handle, :null => false
      t.string :token, :null => true
      t.string :secret, :null => true
      t.string :twitter_type, :null => true
      t.string :twitter_dest, :null => true
      t.string :facebook_type, :null => true
      t.string :facebook_dest, :null => true
      t.integer :connection_ok, :null => false
      t.string :last_error, :null => true
      t.integer :account_id, :null => false
      t.timestamps
    end
    add_foreign_key :network_connections, :accounts, :on_delete => :cascade
  end
end
