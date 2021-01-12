class BlockSyncService

  class BitcoinRpcServerException < StandardError
  end

  class BitcoinRpcServerJsonException < StandardError
  end

  class BitcoinRpcServerUnknownException < StandardError
  end

  def self.get_signing_address_id_by_vin_tx(tx_vin, api_server_request = false)
    if (tx_vin[0]['coinbase'] && tx_vin[0]['txid'].blank?)
      return nil
    end
    txid = tx_vin[0]['txid']
    txid_vout_num = tx_vin[0]['vout']

    request = nil
    if api_server_request
      request = "#{Rails.configuration.app[:utxo_endpoint_url]}/tx/#{txid}"
    else
      request = "#{Rails.configuration.app[:block_syncer_url]}/rest/tx/#{txid}.json"
    end

    response = RestClient.get request
    if response.code != 200
      return {status: 'api error fetch tx'}
    end
    data = JSON.parse response.body

    # grab the addres
    address_id = data['vout'][txid_vout_num]['scriptPubKey']['addresses'][0][12..-1]
    return address_id
  end

  def self.sync_tx_from_mempool!(txid, block_id, is_mempool = true, block_time = Time.now.to_i)
    txdata = BitcoinRpcService.get_transaction(txid)

    found_matching_tx = false
    txdata['vout'].each do |vout|
      if vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a4c..(8d)/
        found_matching_tx = true
        break
      elsif vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a028d/
        found_matching_tx = true
        break
      end
    end

    if found_matching_tx
      self.sync_tx!(txdata, block_id, is_mempool, block_time)
    end
  end

  def self.sync_tx!(tx, block_id, is_mempool = false, block_time = Time.now.to_i, api_server_request = false)
    created_by_address = self.get_signing_address_id_by_vin_tx(tx['vin'], api_server_request)
    parsed_entity = nil

    tx['vout'].each do |vout|
      if vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a4c..(8d)/
        begin
          parsed_entity = ProtocolParserFactory.create_entity(vout['scriptPubKey']['hex'],
                                                              created_by_address)
          puts "Matching hex: #{vout['scriptPubKey']['hex']}"
          # If it is a like, then recreate
          if parsed_entity.instance_of? ProtocolEntityPostLike
            parsed_entity = ProtocolEntityPostLike.extract_vout_and_return_decoded_entity(tx['vout'], created_by_address)
          end
          if parsed_entity.instance_of? ProtocolEntityPostLike2
            parsed_entity = ProtocolEntityPostLike2.extract_vout_and_return_decoded_entity(tx['vout'], created_by_address)
          end
          break
        rescue ProtocolParserFactory::ProtocolParserError => e
          puts 'PROTOCOL ERROR SYNCTX: ' + e.to_s
          next
        end
      elsif vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a028d/
        begin
          # 000000000000000000062643ae96a33ee22255715bd7395e86c513dbb73a23ff
          parsed_entity = ProtocolParserFactory.create_entity(vout['scriptPubKey']['hex'],
                                                              created_by_address)
          puts "Matching hex: #{vout['scriptPubKey']['hex']}"
          # If it is a like, then recreate
          if parsed_entity.instance_of? ProtocolEntityPostLike
            parsed_entity = ProtocolEntityPostLike.extract_vout_and_return_decoded_entity(tx['vout'], created_by_address)
          end
          if parsed_entity.instance_of? ProtocolEntityPostLike2
            parsed_entity = ProtocolEntityPostLike2.extract_vout_and_return_decoded_entity(tx['vout'], created_by_address)
          end
          break
        rescue ProtocolParserFactory::ProtocolParserError => e
          puts 'PROTOCOL ERROR SYNCTX: ' + e.to_s
          next
        end
      end
    end
    puts 'parsed entity is null' + tx['txid'] unless !parsed_entity.nil?
    parsed_entity.populate_domain!(tx['txid'], block_id, block_time, is_mempool) unless parsed_entity.nil?
  end

  def self.perform_sync(block_hash)
    request = "#{Rails.configuration.app[:block_syncer_url]}/rest/block/#{block_hash}.json"
    response = RestClient.get request
    if response.code != 200
      return {status: 'api error fetch'}
    end
    data = JSON.parse response.body

    block_time = data['mediantime']
    tx_count = 0
    tx_skipped = 0

    SyncStat.transaction do

      data['tx'].each do |tx|

        if tx['txid'] == 'c22dc0ab69a9a21c8e4d1ff429fd83d2790b4023789e387d87fdd61100cb0e4f'
          i = 1
        end
        found_matching_tx = false
        tx['vout'].each do |vout|
          if vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a4c..(8d)/
            found_matching_tx = true
            break
          elsif vout['scriptPubKey'] && vout['scriptPubKey']['hex'] =~ /^6a028d/
            found_matching_tx = true
            break
          end
        end

        if found_matching_tx
          self.sync_tx!(tx, data['height'], false, data['mediantime'])
          tx_count = tx_count + 1
        else
          tx_skipped = tx_skipped + 1
        end
      end
    end

    if !data['nextblockhash'].blank?
      return data['nextblockhash'], tx_count, tx_skipped
    end

    return block_hash, tx_count, tx_skipped
  end

  def self.sync_mempool!
    mempool_txs = BitcoinRpcService.get_mempool

    mempool_txs.each do |tx, tx_data|
      self.sync_tx_from_mempool!(tx, tx_data['height'], true, Time.now.to_i)
    end
  end

  def self.sync_next_block!
    sync_stat = SyncStat.find(1)
    # 000000000000000000062643ae96a33ee22255715bd7395e86c513dbb73a23ff
    begin
      puts "Starting sync from #{sync_stat.next_block_to_sync} StartTime: #{Time.now.to_i}"
      (next_block_hash, tx_count, tx_skipped) = self.perform_sync(sync_stat.next_block_to_sync)
      puts "Finished sync for #{sync_stat.next_block_to_sync}, tx_count: #{tx_count}, tx_skipped: #{tx_skipped}. Also found next block #{next_block_hash}. FinishedTime: #{Time.now.to_i}"
      if next_block_hash != sync_stat.next_block_to_sync
        sync_stat.next_block_to_sync = next_block_hash
        sync_stat.last_block_sync_status = 'OK'
        sync_stat.save
      else
        sync_stat.last_block_sync_status = 'OK repeat'
        sync_stat.save
        puts 'All caught up , exitting'
        sleep 3
      end
    rescue => e
      puts e.backtrace
      puts 'exception sync' + e.to_s
    end
  end
end
