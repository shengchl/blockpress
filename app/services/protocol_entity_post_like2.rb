class ProtocolEntityPostLike2 < ProtocolEntity2
  PREFIX = '04'

  def decode_entity(cmd, payload)
    raise ProtocolParserFactory::ProtocolParserError if cmd != ProtocolEntity::OP_PREFIX + PREFIX

    @reply_to_tx_id = @args.first
    raise ProtocolEntity::DomainError.new if @reply_to_tx_id.length != 64

    {
        reply_to_tx_id: @reply_to_tx_id,
    }
  end

  def get_complete_command
    return ProtocolEntity::OP_PREFIX + PREFIX
  end

  def get_params
    [@reply_to_tx_id, @post_body]
  end

  def self.from_entity(entity, created_by_address)
    payload = ProtocolParserFactory::hex_params_to_hex_payload(
        [
            entity[:reply_to_tx_id],
        ]
    )
    return ProtocolEntityPostLike2.new(ProtocolEntity::OP_PREFIX + PREFIX, payload, created_by_address)
  end


  def self.extract_vout_and_return_decoded_entity(vouts, created_by_address)
    constructed_entity = nil
    found_tipped_user_vout = nil
    vouts.each do |vout|
      if vout['scriptPubKey'] && (vout['scriptPubKey']['hex'] =~ /^6a4c..(8d)/ || vout['scriptPubKey']['hex'] =~ /^6a028d/)
        parsed_entity = ProtocolParserFactory.create_entity(vout['scriptPubKey']['hex'],
                                                            created_by_address)
        puts "Matching published hex: #{vout['scriptPubKey']['hex']}"
        if parsed_entity.instance_of? ProtocolEntityPostLike
          constructed_entity = parsed_entity #.add_like_vout_data(vout)
        end
        if parsed_entity.instance_of? ProtocolEntityPostLike2
          constructed_entity = parsed_entity #.add_like_vout_data(vout)
        end
      else
        if vout['scriptPubKey'] &&
            vout['scriptPubKey']['type'] == 'pubkeyhash' &&
            vout['scriptPubKey']['addresses'][0].gsub('bitcoincash:', '') &&
            vout['scriptPubKey']['addresses'][0].gsub('bitcoincash:', '') != created_by_address
          found_tipped_user_vout = vout
        end
      end
    end

    raise 'Fatal' if constructed_entity.nil?
    if found_tipped_user_vout
      constructed_entity.add_like_vout_data(found_tipped_user_vout)
    end
    constructed_entity
  end

  def add_like_vout_data(vout)
    # Only count the tips that were not the same as the sending address (ie: user cannot boost their
    # earned tips simply liking their own stuff)
    if vout['scriptPubKey'] &&
        vout['scriptPubKey']['type'] == 'pubkeyhash' &&
        vout['scriptPubKey']['addresses'][0].gsub('bitcoincash:', '')
      # If there is a tip found, then the value would be at index [1]
      @like_data = {}
      @like_data[:output_number] = vout['n']
      amount = 0.00000001
      sats = vout['value'].blank? ? 0 : vout['value'] / amount

      @like_data[:output_value] = sats
      @like_data[:output_address] = vout['scriptPubKey']['addresses'][0].gsub('bitcoincash:', '')
      return
    end
    @like_data = nil
  end

  def add_tip_if(tip, tx)
    return if tip.blank? || tip == 0 || tip == ''

    raise 'Fatal' if tx.blank?
    raise 'Fatal' if tx['vout'].empty?
    raise 'Fatal' if !tx['vout'].length
    raise 'Fatal' if tx['vout'].length == 0

    post_being_liked = AddressPost.where(:action_tx => tx['txid']).first

    raise 'Fatal not found post' if post_being_liked.nil?

    @address_id_getting_tipped = post_being_liked.address_id

    raise 'Fatal bad address' if @address_id_getting_tipped.blank?
  end

  def do_populate_domain!(block_id, block_time, is_mempool)
    if block_id.blank? || block_time.blank?
      raise ProtocolEntity::DomainError.new
    end

    if @reply_to_tx_id.blank? || @reply_to_tx_id.length != 64
      raise ProtocolEntity::DomainError.new
    end

    address = ProtocolEntity.get_address_ident(@created_by_address)

    entity = AddressPost.find_or_create_by!(:address_id => @created_by_address, :action_tx => @txhash)
    entity.action_tx = @txhash
    entity.action_tx_block_id = block_id
    puts 'about to add like post...' + @txhash
    entity.action_tx_is_mempool = 0
    entity.reply_to_tx_id = @reply_to_tx_id
    entity.is_like = 1
    entity.post_body = @post_body
    entity.tip_amount = @like_data[:output_value] unless @like_data.blank?
    entity.tip_address_id = @like_data[:output_address] unless @like_data.blank?
    entity.post_created_at = block_time
    entity.save!
  end

end