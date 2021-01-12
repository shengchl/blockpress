require 'bitcoin'
class ParseDomain < ActiveInteraction::Base

  string :input

  def parse_name(data)
    p = [data].pack('H*')

    {
        name: p
    }
  end

  def parse_post(data)
    p = [data].pack('H*')
    {
        body: p
    }
  end

  def parse_reply(data)
    nil
  end

  def parse_like(data)

    splitted = data.split(/(..)/)
    reversed = splitted.reverse!.join('')

    {
        like_tx: reversed
    }
  end

  def parse_set_profile_text(data)
    p = [data].pack('H*')
    {
        text: p
    }
  end

  def parse_follow(data)
    {
        address_hex: nil, # => unknown right now since memo truncated it
        address_hex_trunc: data
    }
  end

  def parse_unfollow(data)
    {
        address_hex: nil, # => unknown right now since memo truncated it
        address_hex_trunc: data
    }
  end

  def execute
    cmd = input[4..7]

    if cmd == '8d01'
      payload = input[10..-1]
      return {
          type: 'set_profile_name',
          obj: parse_name(payload)
      }
    end

    if cmd == '8d02'
      payload = input[10..-1]
      return {
          type: 'post',
          obj: parse_post(payload)
      }
    end

    if cmd == '8d03'
      payload = input[10..-1]
      return {
          type: 'reply',
          obj: parse_reply(payload)
      }
    end

    if cmd == '8d04'
      payload = input[10..-1]
      return {
          type: 'like',
          obj: parse_like(payload)
      }
    end

    if cmd == '8d05'
      payload = input[10..-1]
      return {
          type: 'set_profile_text',
          obj: parse_set_profile_text(payload)
      }
    end

    if cmd == '8d06'
      payload = input[10..-1]
      return {
          type: 'follow',
          obj: parse_follow(payload)
      }
    end

    if cmd == '8d07'
      payload = input[10..-1]
      return {
          type: 'unfollow',
          obj: parse_unfollow(payload)
      }
    end

    return nil
  rescue => e
    puts('Exception parsing domain ' + e.to_s)
    return nil
  end
end


