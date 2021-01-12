class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.integer :user_id, :null => true
      t.string :provider
      t.string :uid
      t.string :token
      t.string :secret
      t.attachment :image
      t.string :user_name
      t.timestamps
    end
    add_foreign_key :identities, :users, :on_delete => :cascade
  end
end
