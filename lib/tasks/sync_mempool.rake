require "#{Rails.root}/app/models/bch_block.rb"
require "#{Rails.root}/app/models/bch_transaction.rb"
require "#{Rails.root}/app/models/address_ident.rb"
require "#{Rails.root}/app/models/address_hashtag.rb"
require "#{Rails.root}/app/models/address_like.rb"
require "#{Rails.root}/app/models/address_following.rb"
require "#{Rails.root}/app/models/address_post.rb"
require "#{Rails.root}/app/models/address_post_image.rb"
require "#{Rails.root}/app/models/address_post_replies.rb"
require "#{Rails.root}/app/models/address_post_repost.rb"
require "#{Rails.root}/app/use_cases/parse_domain.rb"
require "#{Rails.root}/app/use_cases/populate_domain.rb"

namespace :bch do
  desc 'Sync Mempool txs'

  task :start_mempool_sync  => :environment do
    BlockSyncService.sync_mempool!
  end

  task :start_mempool_sync_loop  => :environment do
    # GENESIS: 0000000000000000006ebda1fcb1ff51856a71407b3da40a502806bfd54a63ce
    # april 18th: 0000000000000000023c3c428449b68c0133752cc4e2fe541f6fbaf880f5429f
    while true
      BlockSyncService.sync_mempool!
      sleep 2
    end
  end

end