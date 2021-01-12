class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :account_guid, :null => false
      t.string :site_name, :null => false

      t.timestamps
    end
    add_index :accounts, :site_name
  end
end


