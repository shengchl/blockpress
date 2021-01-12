# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180509011237) do

  create_table "account_managers", force: :cascade do |t|
    t.integer  "account_id", limit: 4
    t.integer  "user_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "account_managers", ["account_id"], name: "fk_rails_b93b98f132", using: :btree
  add_index "account_managers", ["user_id"], name: "fk_rails_794d4574ea", using: :btree

  create_table "accounts", force: :cascade do |t|
    t.string   "account_guid", limit: 255, null: false
    t.string   "site_name",    limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "accounts", ["site_name"], name: "index_accounts_on_site_name", length: {"site_name"=>191}, using: :btree

  create_table "address_followings", force: :cascade do |t|
    t.string   "action_tx",            limit: 80, null: false
    t.integer  "action_tx_block_id",   limit: 4
    t.integer  "action_tx_is_mempool", limit: 4
    t.string   "follower_address_id",  limit: 80, null: false
    t.string   "following_address_id", limit: 80, null: false
    t.integer  "deleted",              limit: 4,  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_followings", ["action_tx"], name: "index_address_followings_on_action_tx", unique: true, using: :btree
  add_index "address_followings", ["deleted"], name: "index_address_followings_on_deleted", using: :btree
  add_index "address_followings", ["follower_address_id", "following_address_id"], name: "follower_address_idx", using: :btree
  add_index "address_followings", ["follower_address_id"], name: "index_address_followings_on_follower_address_id", using: :btree
  add_index "address_followings", ["following_address_id"], name: "index_address_followings_on_following_address_id", using: :btree

  create_table "address_hashtags", force: :cascade do |t|
    t.string   "hashtag",    limit: 80, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_hashtags", ["hashtag"], name: "index_address_hashtags_on_hashtag", unique: true, using: :btree

  create_table "address_idents", force: :cascade do |t|
    t.string   "address_id",                    limit: 50,  null: false
    t.string   "name",                          limit: 76
    t.string   "set_profile_name_tx",           limit: 255
    t.integer  "set_profile_name_block_id",     limit: 4
    t.integer  "set_profile_name_is_mempool",   limit: 4
    t.string   "bio",                           limit: 220
    t.string   "set_profile_bio_tx",            limit: 255
    t.integer  "set_profile_bio_block_id",      limit: 4
    t.integer  "set_profile_bio_is_mempool",    limit: 4
    t.string   "avatar",                        limit: 255
    t.string   "set_profile_avatar_tx",         limit: 255
    t.integer  "set_profile_avatar_block_id",   limit: 4
    t.integer  "set_profile_avatar_is_mempool", limit: 4
    t.string   "header",                        limit: 255
    t.string   "set_profile_header_tx",         limit: 255
    t.integer  "set_profile_header_block_id",   limit: 4
    t.integer  "set_profile_header_is_mempool", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_idents", ["address_id"], name: "ident_addy_idx", unique: true, using: :btree
  add_index "address_idents", ["name"], name: "ident_name_idx", using: :btree

  create_table "address_images", force: :cascade do |t|
    t.string   "action_tx",            limit: 70
    t.integer  "action_tx_block_id",   limit: 4
    t.integer  "action_tx_is_mempool", limit: 4
    t.string   "address_id",           limit: 50,  null: false
    t.string   "caption",              limit: 217
    t.string   "image_link_or_ipfs",   limit: 217
    t.integer  "image_created_at",     limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_images", ["action_tx"], name: "addy_images_atx_idx", unique: true, using: :btree
  add_index "address_images", ["action_tx_block_id"], name: "addy_images_blockid_idx", using: :btree
  add_index "address_images", ["address_id"], name: "addy_images_addyid_idx", using: :btree

  create_table "address_likes", force: :cascade do |t|
    t.string   "action_tx",               limit: 80, null: false
    t.integer  "action_tx_block_id",      limit: 4
    t.integer  "action_tx_is_mempool",    limit: 4
    t.string   "liker_address_id",        limit: 80, null: false
    t.string   "tip_receiver_address_id", limit: 80
    t.string   "like_tx",                 limit: 80, null: false
    t.integer  "tip_amount",              limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_likes", ["action_tx"], name: "index_address_likes_on_action_tx", unique: true, using: :btree
  add_index "address_likes", ["like_tx"], name: "index_address_likes_on_like_tx", using: :btree
  add_index "address_likes", ["liker_address_id"], name: "index_address_likes_on_liker_address_id", using: :btree
  add_index "address_likes", ["tip_receiver_address_id"], name: "index_address_likes_on_tip_receiver_address_id", using: :btree

  create_table "address_post_hashtag_mappings", force: :cascade do |t|
    t.string   "hashtag",    limit: 80, null: false
    t.string   "post_tx_id", limit: 80, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_post_hashtag_mappings", ["hashtag", "post_tx_id"], name: "post_tx_hash_idx", unique: true, using: :btree
  add_index "address_post_hashtag_mappings", ["hashtag"], name: "index_address_post_hashtag_mappings_on_hashtag", using: :btree
  add_index "address_post_hashtag_mappings", ["post_tx_id"], name: "index_address_post_hashtag_mappings_on_post_tx_id", using: :btree

  create_table "address_post_pay_outputs", force: :cascade do |t|
    t.string   "action_tx",         limit: 70, null: false
    t.string   "output_address_id", limit: 50, null: false
    t.integer  "output_value",      limit: 4,  null: false
    t.integer  "output_number",     limit: 4,  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_post_pay_outputs", ["action_tx"], name: "addy_posts_po_atx_idx", using: :btree
  add_index "address_post_pay_outputs", ["output_address_id"], name: "addy_posts_po_oai_idx", using: :btree
  add_index "address_post_pay_outputs", ["output_value"], name: "addy_posts_po_ov_idx", using: :btree

  create_table "address_post_reposts", force: :cascade do |t|
    t.string   "originating_tx",      limit: 80, null: false
    t.string   "repost_tx_id",        limit: 80, null: false
    t.string   "reposted_post_tx_id", limit: 80, null: false
    t.string   "address_id",          limit: 80, null: false
    t.integer  "repost_created_at",   limit: 4
    t.integer  "block_id_synced",     limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "address_post_reposts", ["address_id"], name: "index_address_post_reposts_on_address_id", using: :btree
  add_index "address_post_reposts", ["repost_tx_id"], name: "index_address_post_reposts_on_repost_tx_id", unique: true, using: :btree
  add_index "address_post_reposts", ["reposted_post_tx_id"], name: "index_address_post_reposts_on_reposted_post_tx_id", using: :btree

  create_table "address_posts", force: :cascade do |t|
    t.string   "action_tx",            limit: 70
    t.integer  "action_tx_block_id",   limit: 4
    t.integer  "action_tx_is_mempool", limit: 4
    t.string   "address_id",           limit: 50,              null: false
    t.string   "post_body",            limit: 250
    t.string   "post_image_ipfs",      limit: 255
    t.string   "reply_to_tx_id",       limit: 70
    t.integer  "is_like",              limit: 4,   default: 0, null: false
    t.integer  "post_created_at",      limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "community",            limit: 80
    t.integer  "media_type",           limit: 4
    t.string   "media_payload",        limit: 255
    t.integer  "sequence",             limit: 4
    t.integer  "badge_count",          limit: 4
    t.integer  "tip_amount",           limit: 4
    t.string   "tip_address_id",       limit: 255
  end

  add_index "address_posts", ["action_tx"], name: "addy_posts_atx_idx", unique: true, using: :btree
  add_index "address_posts", ["action_tx_block_id"], name: "addy_posts_blockid_idx", using: :btree
  add_index "address_posts", ["address_id"], name: "addy_posts_addyid_idx", using: :btree
  add_index "address_posts", ["community"], name: "index_address_posts_on_community", using: :btree
  add_index "address_posts", ["is_like"], name: "addy_posts_is_like_atx_idx", using: :btree
  add_index "address_posts", ["media_type"], name: "index_address_posts_on_media_type", using: :btree
  add_index "address_posts", ["reply_to_tx_id"], name: "addy_repl_posts_atx_idx", using: :btree
  add_index "address_posts", ["sequence"], name: "index_address_posts_on_sequence", using: :btree

  create_table "broadcast_transactions", force: :cascade do |t|
    t.string   "txhash",             limit: 80,    null: false
    t.text     "raw_tx",             limit: 65535, null: false
    t.text     "obj_tx",             limit: 65535, null: false
    t.integer  "is_success",         limit: 4
    t.integer  "attempt_count",      limit: 4
    t.string   "last_attempt_error", limit: 255
    t.integer  "last_attempted_at",  limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "broadcast_transactions", ["attempt_count"], name: "index_broadcast_transactions_on_attempt_count", using: :btree
  add_index "broadcast_transactions", ["is_success"], name: "index_broadcast_transactions_on_is_success", using: :btree
  add_index "broadcast_transactions", ["last_attempted_at"], name: "index_broadcast_transactions_on_last_attempted_at", using: :btree
  add_index "broadcast_transactions", ["txhash"], name: "index_broadcast_transactions_on_txhash", unique: true, using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id",            limit: 4
    t.string   "provider",           limit: 255
    t.string   "uid",                limit: 255
    t.string   "token",              limit: 255
    t.string   "secret",             limit: 255
    t.string   "image_file_name",    limit: 255
    t.string   "image_content_type", limit: 255
    t.integer  "image_file_size",    limit: 4
    t.datetime "image_updated_at"
    t.string   "user_name",          limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "identities", ["user_id"], name: "fk_rails_0b043a2c9f", using: :btree

  create_table "local_spent_utxos", force: :cascade do |t|
    t.string   "address",       limit: 80, null: false
    t.string   "txhash",        limit: 80, null: false
    t.integer  "output_number", limit: 4,  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "local_spent_utxos", ["address"], name: "index_local_spent_utxos_on_address", using: :btree
  add_index "local_spent_utxos", ["output_number"], name: "index_local_spent_utxos_on_output_number", using: :btree
  add_index "local_spent_utxos", ["txhash"], name: "index_local_spent_utxos_on_txhash", using: :btree

  create_table "mempool_utxo_by_address", force: :cascade do |t|
    t.string   "address",       limit: 80,    null: false
    t.string   "txhash",        limit: 80,    null: false
    t.string   "script_hex",    limit: 255,   null: false
    t.integer  "output_number", limit: 4,     null: false
    t.text     "obj_tx",        limit: 65535
    t.integer  "value",         limit: 8,     null: false
    t.integer  "descendants",   limit: 4
    t.integer  "fee_value",     limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "mempool_utxo_by_address", ["address", "txhash", "output_number"], name: "mempool_tx_compound", unique: true, using: :btree
  add_index "mempool_utxo_by_address", ["address"], name: "mempool_tx_address", using: :btree
  add_index "mempool_utxo_by_address", ["txhash"], name: "mempool_tx_txhash", using: :btree

  create_table "network_connections", force: :cascade do |t|
    t.string   "network",            limit: 255, null: false
    t.string   "uid",                limit: 255, null: false
    t.string   "image_file_name",    limit: 255
    t.string   "image_content_type", limit: 255
    t.integer  "image_file_size",    limit: 4
    t.datetime "image_updated_at"
    t.string   "handle",             limit: 255, null: false
    t.string   "token",              limit: 255
    t.string   "secret",             limit: 255
    t.string   "twitter_type",       limit: 255
    t.string   "twitter_dest",       limit: 255
    t.string   "facebook_type",      limit: 255
    t.string   "facebook_dest",      limit: 255
    t.integer  "connection_ok",      limit: 4,   null: false
    t.string   "last_error",         limit: 255
    t.integer  "account_id",         limit: 4,   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "network_connections", ["account_id"], name: "fk_rails_0c800e9c1c", using: :btree

  create_table "sync_stats", force: :cascade do |t|
    t.string   "next_block_to_sync",     limit: 255, null: false
    t.string   "last_block_sync_status", limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "unspent_utxos", force: :cascade do |t|
    t.string   "address",    limit: 80,    null: false
    t.text     "raw_data",   limit: 65535, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "unspent_utxos", ["address"], name: "index_unspent_utxos_on_address", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "encrypted_password",     limit: 255,   default: "", null: false
    t.string   "reset_password_token",   limit: 160
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,     default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "confirmation_token",     limit: 160
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.string   "username",               limit: 80,                 null: false
    t.text     "wallet_phrase",          limit: 65535
    t.integer  "last_child_node_i",      limit: 4
    t.text     "masterxpub",             limit: 65535
    t.string   "wif",                    limit: 255
    t.string   "address_legacy",         limit: 80
    t.string   "address_legacy_hex",     limit: 80
    t.string   "address_cash",           limit: 80
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "badge_count",            limit: 4
  end

  add_index "users", ["address_cash"], name: "index_users_on_address_cash", using: :btree
  add_index "users", ["address_legacy"], name: "index_users_on_address_legacy", using: :btree
  add_index "users", ["address_legacy_hex"], name: "index_users_on_address_legacy_hex", using: :btree
  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "vins", force: :cascade do |t|
    t.string   "parent_tx",  limit: 255,   null: false
    t.string   "vin_tx",     limit: 255,   null: false
    t.text     "vin_blob",   limit: 65535, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_foreign_key "account_managers", "accounts", on_delete: :cascade
  add_foreign_key "account_managers", "users", on_delete: :cascade
  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "network_connections", "accounts", on_delete: :cascade
end
