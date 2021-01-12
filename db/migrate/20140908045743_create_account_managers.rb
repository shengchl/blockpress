class CreateAccountManagers < ActiveRecord::Migration
  def change
    create_table :account_managers do |t|
      t.integer :account_id, :null => true
      t.integer :user_id, :null => true
      t.timestamps
    end
    add_foreign_key :account_managers, :accounts, :on_delete => :cascade
    add_foreign_key :account_managers, :users, :on_delete => :cascade
  end
end
