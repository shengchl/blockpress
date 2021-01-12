require 'bitcoin'

class NoUtxoAvailableException < Exception
end
class TxMempoolConflictException < Exception
  attr_reader :address
  attr_reader :txhash
  attr_reader :output_number
  def initialize(address, txhash, output_number)
    @address = address
    @txhash = txhash
    @output_number = output_number
  end
end
class ServiceException < Exception
  attr_reader :type

  def initialize(type)
    @type = type
  end
end

class Wallets::PublishTx < ActiveInteraction::Base
  object :protocol_entity2
  string :address_cash
  integer :user_id
  integer :tip, default: 0
  string :address_id_getting_tipped, default: nil

  def get_single_unspent_output(address, tip_amount)
    begin
      utxos = BitcoinRpcService.get_utxos(address)
    rescue => e
      raise ServiceException.new('UNSPENT_FETCH')
    end
    utxos_sorted = utxos.sort_by { |k| k['value'].to_i }
    utxos_sorted.reverse!
    utxos_sorted.delete_if {|x| x['value'].to_i < (800 + tip_amount) } # Maybe 1000?

    utxo_found = nil
    utxos_sorted.each do |unspent_output|
      # Make sure utxo has not been blacklisted
      found_spent = LocalSpentUtxo.where(:address => address,
                                        :txhash => unspent_output['tx_hash'],
                                        :output_number => unspent_output['tx_pos']).first

      next if found_spent

      tx = BitcoinRpcService.get_transaction(unspent_output['tx_hash'])
      output_position = unspent_output['tx_pos']
      script_hex = tx['vout'][output_position]['scriptPubKey']['hex']
      return {
          transaction_hash: unspent_output['tx_hash'],
          script_hex: script_hex,
          index: unspent_output['tx_pos'],
          value: unspent_output['value'],
      }
    end
    return nil
  end

  def build_and_broadcast_tx(wif, output_recipient_address, command, params, tip = 0, address_id_getting_tipped = nil)
    keep_trying = true
    while keep_trying do
      keep_trying = false # Only try again if there is a mempool exception
      # All the fields we need to broadcast a simple 1 vin and 2 vouts (one being an OP_RETURN)
      unspent_output = get_single_unspent_output(output_recipient_address, tip)
      raise NoUtxoAvailableException.new unless !unspent_output.blank?
      tx_hash = unspent_output[:transaction_hash]
      script_hex = unspent_output[:script_hex]
      output_index = unspent_output[:index]
      value = unspent_output[:value]

      # Make the request to broadcast
      request = "#{Rails.configuration.app[:utxo_endpoint_url]}/build_and_broadcast_tx"
      address_legacy = Cashaddress.to_legacy('bitcoincash:' + output_recipient_address)

      address_id_getting_tipped_legacy = nil
      if tip && tip > 0
        address_id_getting_tipped_legacy = Cashaddress.to_legacy('bitcoincash:' + address_id_getting_tipped)
      end
      body_payload = {
          wif: wif,
          output_recipient_address: address_legacy,
          tx_hash: tx_hash,
          script_hex: script_hex,
          output_index: output_index,
          value: value,
          command: command,
          params: params,
          satoshis_in_output: value,
          tip: tip,
          address_id_getting_tipped: address_id_getting_tipped_legacy
      }
      send_json = body_payload.to_json
      response = RestClient.post request, send_json, {content_type: :json, accept: :json}
      raise ServiceException.new('BROADCAST_API') unless response.code == 200
      result = JSON.parse response.body

      # If there is a mempool conflict (oops, we screwed up. Try it again after marking it as spent)
      keep_trying = false

      # 64: dust
      if result['success'] != true && result['message'] =~ /^64\: dust/
        LocalSpentUtxo.find_or_create_by!(:address => output_recipient_address,
                                          :txhash => tx_hash,
                                          :output_number => output_index)
        # raise TxMempoolConflictException.new(address_cash, tx_hash, output_index)
        puts 'Dust inputs, ignore this utxo'
        keep_trying = true
        next
      end

      if result['success'] != true && result['message'] =~ /conflict/i # Is this RIGHT???
        LocalSpentUtxo.find_or_create_by!(:address => output_recipient_address,
                                          :txhash => tx_hash,
                                          :output_number => output_index)
        # raise TxMempoolConflictException.new(address_cash, tx_hash, output_index)
        puts 'Double spent happened, TRYING AGAIN'
        keep_trying = true
        next
      end

      if result['success'] != true
        raise ServiceException.new('BROADCAST_API')
      end

      if result['success']
        return result
      end
      return result
    end
  end

  def bin_to_hex(s)
    s.each_byte.map { |b| b.to_s(16) }.join
  end

  def hex_to_bin(s)
    s.scan(/../).map { |x| x.hex.chr }.join
  end

  def store_tx(tx_obj)
    broadcast = BroadcastTransaction.find_or_initialize_by(:txhash => tx_obj['tx_obj']['hash'])
    broadcast.raw_tx = tx_obj['raw_tx']
    broadcast.obj_tx = tx_obj['tx_obj'].to_s
    broadcast.is_success = 0
    broadcast.attempt_count = 0
    broadcast.last_attempt_error
    broadcast.save!
  end

  def execute
    # Get the user we are creating transaction for
    user = User.find_by_id(user_id)
    tx_obj = build_and_broadcast_tx(user.wif,
                                    address_cash,
                                    protocol_entity2.command,
                                    protocol_entity2.args,
                                    tip,
                                    address_id_getting_tipped)
    saved = LocalSpentUtxo.find_or_create_by!(:address => address_cash,
                                              :txhash => tx_obj['input_tx_hash'],
                                              :output_number => tx_obj['output_number'])
    store_tx(tx_obj)
    return {
        success: true,
        message: 'Broadcasted',
        object: tx_obj,
        sender_address: address_cash
    }
  rescue NoUtxoAvailableException => e
    return {
        success: false,
        message: 'No available balance',
        code: 'INSUFFICIENT_BALANCE',
    }
  rescue ServiceException => e

    return {
        success: false,
        message: 'Service exception - ' + e.type,
        code: 'GENERAL_ERROR',
    }
  end
end


