class BitcoinRpcService

  UTXO_ENDPOINT_URL = Rails.configuration.app[:utxo_endpoint_url]
  BROADCASTER_ENDPOINT_URL = Rails.configuration.app[:broadcaster_endpoint_url]

  class BitcoinRpcServerException < StandardError
  end

  class BitcoinRpcServerJsonException < StandardError
  end

  class BitcoinRpcServerUnknownException < StandardError
  end

  def self.valid_json?(string)
    begin
      !!JSON.parse(string)
    rescue JSON::ParserError
      false
    end
  end

  def self.get_utxos(address)
    begin
      legacy = Cashaddress.to_legacy('bitcoincash:' + address)
      request = "#{UTXO_ENDPOINT_URL}/listunspent/#{legacy}"
      response = RestClient.get request

      raise BitcoinRpcServerException.new unless response.code == 200
      raise BitcoinRpcServerJsonException.new unless valid_json? response.body

      result = JSON.parse response.body
      # Expecting format:
      # [
      #  {
      #    txhash: '123', # txhash of the utxo
      #    index: 0,      # Index/output number
      #    value: 134,    # Value of output in satoshis
      #  }, ...
      #
      # ]
      result
    end
  end

  def self.get_balance(address)
    begin
      request = "#{UTXO_ENDPOINT_URL}/balances/#{address}"
      response = RestClient.get request

      raise BitcoinRpcServerException.new unless response.code == 200
      raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body

      result = JSON.parse response.body
      result
    end
  end

  def self.get_transaction(hash)
    begin
      request = "#{UTXO_ENDPOINT_URL}/tx/#{hash}"
      response = RestClient.get request

      raise BitcoinRpcServerException.new unless response.code == 200
      raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body

      result = JSON.parse response.body
      result
    end
  end

  def self.get_block_height
    begin
      request = "#{UTXO_ENDPOINT_URL}/blockheight"
      response = RestClient.get request

      raise BitcoinRpcServerException.new unless response.code == 200
      raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body

      result = JSON.parse response.body
      result
    end
  end

  def self.get_mempool
    begin
      request = "#{UTXO_ENDPOINT_URL}/mempool"
      response = RestClient.get request

      raise BitcoinRpcServerException.new unless response.code == 200
      raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body

      result = JSON.parse response.body
      result
    end
  end

  def self.build_broadcast_tx(utxo, outputs_except_op_return, op_return_data)
    begin
      request = "#{BROADCASTER_ENDPOINT_URL}/broadcast"
      response = RestClient.post request, { raw_tx_hex: raw_tx_hex}

      if response.code == 200
        raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body
        body = JSON.parse response.body
        return {
            success: true,
            txhash: body['txhash']
        }
      end

      if response.code == 422
        raise BitcoinRpcServerJsonException.new unless self.valid_json? response.body
        body = JSON.parse response.body
        return {
            success: false,
            code: body['code']
            # Known codes:
            # MEMPOOL_CONFLICT
            # DUST
            # PRIORITY_LOW
            # Anything else should return 500 error
        }
      end
      raise BitcoinRpcServerUnknownException.new
    end
  end
end