require 'bitcoin'
class Wallets::GetUnspentUtxosByAddress < ActiveInteraction::Base
  string :address

  def query_unspent_utxo_by_address(address)
    Rails.logger.warn('query_unspent_utxo_by_address' + address)
    unspent_utxo = UnspentUtxo.find_or_initialize_by(:address => address)
    if unspent_utxo.raw_data.blank? || (unspent_utxo.updated_at + 5.seconds) < Time.now
      UnspentUtxo.transaction do
        address = address.gsub('bitcoincash:','')
        request = "https://api.blockchair.com/bitcoin-cash/outputs?q=recipient(#{address}),is_spent(0)"
        response = RestClient.get request
        if response.code != 200
          raise '3rd party service api error'
        end
        result = JSON.parse response.body

        unspent_utxo.raw_data = result.to_json
        unspent_utxo.save!
      end
    end
    utxo = JSON.parse unspent_utxo.raw_data
    utxo
  end

  def execute
    utxos = query_unspent_utxo_by_address(address)
    utxos
  end
end


