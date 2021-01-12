class ChangeToUtf8mb4 < ActiveRecord::Migration
  def change
    # for each table that will store unicode execute:
    execute 'ALTER TABLE address_idents CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin'
    # for each string/text column with unicode content execute:
    # execute "ALTER TABLE address_idents CHANGE name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin"
    # execute "ALTER TABLE address_idents CHANGE bio VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin"

    execute 'ALTER TABLE address_posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin'
    # for each string/text column with unicode content execute:
    # execute "ALTER TABLE posts CHANGE post_body VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin"

  end
end
