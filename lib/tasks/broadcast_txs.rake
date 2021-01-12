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

def broadcast_next_txs

end

namespace :bch do
  desc 'Broadcast txs in queue'
  task :start_broadcaster  => :environment do
    while true
      begin
        puts "Starting broadcast StartTime: #{Time.now.to_i}"

        broadcast_next_txs
        puts "Finished broadcast. FinishedTime: #{Time.now.to_i}"
        puts "Sleeping...1 seconds"
        sleep_duration = 1

      rescue => e
        puts "Exception broadcasting: " + e.to_s
      end
      sleep 1
    end
  end
end