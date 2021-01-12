class AddTipAmountToPosts < ActiveRecord::Migration
  change_table :address_posts do |t|
    t.integer :tip_amount
    t.string :tip_address_id
  end
end
