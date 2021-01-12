class ProtocolEntity2
  OP_PREFIX = '8d'

  class DomainError < StandardError
  end

  attr_reader :created_by_address
  attr_reader :txhash
  attr_reader :hex
  attr_reader :payload
  attr_reader :command
  attr_reader :args

  def initialize(command, payload, created_by_address)
    raise ProtocolParserFactory::ProtocolParserError.new if created_by_address.size != 42

    # Next 1 byte is the length of whole payload hex[4..5]
    # Command is at hex[6..9]
    # Payload is at hex[10..-1]
    @hex = ProtocolParserFactory::OP_RETURN_CODE + ProtocolParserFactory::OP_RETURN_CODE_PUSH_COMMAND + command + payload
    @created_by_address = created_by_address
    raise 'Error' if command.blank? || @created_by_address.blank?
    @payload = payload
    @command = command
    @args = ProtocolParserFactory::get_params_array(payload)
    @decoded_entity = self.decode_entity(command, payload)
  end

  def self.get_address_ident(address_id)
    address = AddressIdent.find_by_address_id(address_id)
    if address.blank?
      # Make sure to get the legacy format
      legacy = Cashaddress.to_legacy('bitcoincash:' + address_id.to_s)
      address = AddressIdent.find_or_create_by!({
                                                    :address_id => address_id,
                                                })
    end
    address
  end

  def encode_to_hex_payload
    raise 'Impl'
  end

  def get_entity
    @decoded_entity
  end

  def decode_entity(hex, payload)
    raise 'Impl required'
  end

  def get_complete_command
    raise 'Impl required'
  end

  def get_params
    raise 'Impl required'
  end

  def get_op_return_data
    raise 'Impl required'
  end

  def self.from_entity(entity)
    raise 'Impl required'
  end

  def get_op_return_data
    @hex[6..-1]
  end

  def populate_domain!(txhash, block_id, block_time, is_mempool = false)
    raise ProtocolParserFactory::ProtocolParserError.new if txhash.size != 64
    raise ProtocolParserFactory::ProtocolParserError.new if block_id.blank?
    raise ProtocolParserFactory::ProtocolParserError.new if block_time.blank?
    @txhash = txhash
    do_populate_domain!(block_id, block_time, is_mempool)
    true
  end

  private
  def do_populate_domain!(txhash, block_id, block_time, is_mempool = false)
    raise 'Impl required'
  end
end #00000000000000000074ea584b83667bf040a304c78bd554e72b24b695f7fcd9