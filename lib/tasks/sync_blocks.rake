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
  desc 'Sync BCH blocks'
  task :start_sync  => :environment do
      # GENESIS: 0000000000000000006ebda1fcb1ff51856a71407b3da40a502806bfd54a63ce
      # april 18th: 0000000000000000023c3c428449b68c0133752cc4e2fe541f6fbaf880f5429f
      BlockSyncService.sync_next_block!
  end
  task :start_sync_loop  => :environment do
    # GENESIS: 0000000000000000006ebda1fcb1ff51856a71407b3da40a502806bfd54a63ce
    # april 18th: 0000000000000000023c3c428449b68c0133752cc4e2fe541f6fbaf880f5429f
    while true
      BlockSyncService.sync_next_block!
      sleep 2
    end
  end
  task :update_post_tips  => :environment do
    updates = AddressPostPayOutput.all
    updates.each_slice(50) do |slice|
      AddressPost.transaction do
        slice.each do |po|
          post_to_update = AddressPost.where(:action_tx => po.action_tx).first
          post_to_update.tip_amount = po.output_value
          post_to_update.tip_address_id = po.output_address_id
          post_to_update.save!
        end
      end
    end
  end
end
