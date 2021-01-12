class ProtocolParserFactory
  class ProtocolParserError < StandardError
  end

  OP_RETURN_CODE = '6a'
  OP_RETURN_CODE_PUSH_COMMAND = '02'


  def self.get_params_array(hex)
    params = []
    # Set the data pointer to the first argument to initialize loop
    data_ptr = 0
    while data_ptr < hex.length
      next_bytes_or_op_code = hex[data_ptr..(data_ptr+1)].to_i(16)
      if next_bytes_or_op_code == 76
        # Advance data ptr if PUSHDATA1
        data_ptr = data_ptr + 2
        next_bytes_or_op_code = hex[data_ptr..(data_ptr+1)].to_i(16)
      end
      data_ptr = data_ptr + 2
      argument_data = hex[data_ptr..((data_ptr + next_bytes_or_op_code*2)-1)]
      data_ptr = data_ptr + next_bytes_or_op_code*2
      params.push(argument_data)
    end
    params
  end

  def self.hex_params_to_hex_payload(params)
    hex = ''
    params.each do |param|
      param_byte_length = ProtocolParserFactory.string_length_bytes(param) / 2
      if param_byte_length <= 75
        if param_byte_length < 16
          hex = hex + '0' + param_byte_length.to_s(16)
        else
          hex = hex + param_byte_length.to_s(16)
        end
        hex = hex + param
      else
        if param_byte_length < 16
          hex = hex + '4c' + '0' + param_byte_length.to_s(16)
        else
          hex = hex + '4c' + param_byte_length.to_s(16)
        end
        hex = hex + param
      end
    end
    hex
  end

  def self.generate_op_return_prefix(blob)
    return OP_RETURN_CODE + '4c' + self.length_bytes_div_2(blob)
  end

  def self.bin_to_hex(s)
    s.each_byte.map { |b| b.to_s(16) }.join
  end

  def self.bin_to_hex_utf8(s)
    s.each_byte.map { |b| b.to_s(16) }.join
  end

  def self.utf8_to_hex(s)
    s.unpack('H*').first
  end

  def self.hex_to_utf8(h)
    1 #h.unpack('U*')
  end


  def self.length_bytes(total_hex)
    bytes = total_hex.bytesize

    if bytes < 16
      return '0' + bytes.to_s(16)
    end

    return bytes.to_s(16)
  end

  def self.length_bytes_div_2(total_hex)
    bytes = total_hex.bytesize
    bytes = bytes / 2
    if bytes < 16
      return '0' + bytes.to_s(16)
    end

    return bytes.to_s(16)
  end

  def self.string_length_bytes(str)
    bytes = str.bytesize
    return bytes
  end

  def self.create_entity(hex, created_by_address)
    created_by_address = created_by_address.gsub('bitcoincash:', '')
    raise ProtocolParserError.new if created_by_address.size != 42
    raise ProtocolParserError.new if '6a' != hex[0..1]

    command_len_push = hex[2..3]
    cmd = hex[4..7]
    payload = hex[8..-1]
    if cmd == ProtocolEntity::OP_PREFIX + '01'
      return ProtocolEntitySetName2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '02'
      return ProtocolEntityPost2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '03'
      return ProtocolEntityPostReply2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '04'
      return ProtocolEntityPostLike2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '05'
      return ProtocolEntitySetProfileText2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '06'
      return ProtocolEntityFollow2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '07'
      return ProtocolEntityUnfollow2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '08'
      return ProtocolEntitySetProfileHeader2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '09'
      return ProtocolEntityPostMedia2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '10'
      return ProtocolEntitySetProfileAvatar2.new(cmd, payload, created_by_address)
    end

    if cmd == ProtocolEntity::OP_PREFIX + '11'
      return ProtocolEntityPostCommunity2.new(cmd, payload, created_by_address)
    end

    raise ProtocolParserError.new
  end
end
