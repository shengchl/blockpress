class AddBadgeCountForUsers < ActiveRecord::Migration
  change_table :users do |t|
    t.integer :badge_count
  end
end
