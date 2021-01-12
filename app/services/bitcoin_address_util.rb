require 'bitcoin'
class BitcoinAddressUtil
  def self.get_hex_versions(base58address)
    raise 'Invalid address' if base58address.blank?
    hex_version = Bitcoin.decode_base58(base58address)
    hex_trunc_version = hex_version[2..-1][0..39]
    return hex_version, hex_trunc_version
  end
end