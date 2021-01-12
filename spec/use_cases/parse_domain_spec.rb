require 'rails_helper'
require 'spec_helper'

include Warden::Test::Helpers
Warden.test_mode!

def bin_to_hex(s)
  s.each_byte.map { |b| b.to_s(16) }.join
end
describe ParseDomain do
  it 'Set profile name 8d01	name(76)' do

    expect(
        ParseDomain.run!(:input => '6a028d010474657374')
    ).to eq ({
        type: 'set_profile_name',
        obj: {
            name: 'test'
        }
    })
  end

  it 'Create a post 8d02	message(76)' do

    expect(
        ParseDomain.run!(:input => '6a028d0204746573742032')
    ).to eq ({
        type: 'post',
        obj: {
            body: 'test 2'
        }
    })

  end

  it 'Reply to memo	8d03	txhash(20), message(53)', skip: true do

    expect(
        ParseDomain.run!(:input => 'OP_RETURN 6d03 xxx')
    ).to eq 'notdone'
  end
# 6a026d04201f1f63293441c673033f9112bab1b3071b2f06f68d3032a23ba9eda819694520
  it 'Like / tip memo	0x6d04	txhash(20)' do
        #  b7b9376659920ecbaad794bfb1cd0a5da095f9231fe1f4243474c9606623fc14
                                    #1f1f63293441c673033f9112bab1b3071b2f06f68d3032a23ba9eda819694520
                                         #20456919a8eda93ba232308df6062f1b07b3b1ba12913f0373c6413429631f1f


    expect(
        ParseDomain.run!(:input => '6a028d04201f1f63293441c673033f9112bab1b3071b2f06f68d3032a23ba9eda819694520')
    ).to eq ({
        type: 'like',
        obj: {
            like_tx: '20456919a8eda93ba232308df6062f1b07b3b1ba12913f0373c6413429631f1f'
        }
    })
  end

  it 'Set profile text 8d05	message(76)	V2' do

    expect(
        ParseDomain.run!(:input => '6a028d0504746573742032')
    ).to eq ({
        type: 'set_profile_text',
        obj: {
            text: 'test 2'
        }
    })

  end

  # Here is out address are encoded in Memo protocol:
  # They drop the last digits

  # Charles: 17R9gr4GUfqVwLriAomJ5RqmTJievnQQ5Z
  #              decoded: 004661FD4469551A3A8CE4B67585EC179BCE4E00E3 C09E098C
  # FOLLOW b:  6a02 6d06 14 4661fd4469551a3a8ce4b67585ec179bce4e00e3

  # CryptoWyren: 12HdPLVwGBeftrAPXoWVQBZrQcqt9srhqi
               # decoded: 000E1D2767F3454783090868A3DE9358AAE4D462B5 282CE831
  # FOLLOW a:  6a02 6d06 14 0e1d2767f3454783090868a3de9358aae4d462b5

  # Craig: 1EWnweLyUSB1iz4pqtBmE9ykiz8VReVrGv
  #              decoded: 00943C0C73F7C69379B2E7C325BAD489AC94DA5DA4 662015AF
  # Follow c:  6a02 6d06 14 943c0c73f7c69379b2e7c325bad489ac94da5da4
  it 'Follow user	8d06	address(35)' do

    expect(
        ParseDomain.run!(:input => '6a028d06144661fd4469551a3a8ce4b67585ec179bce4e00e3')
    ).to eq ({
        type: 'follow',
        obj: {
            address_hex: nil, # '004661FD4469551A3A8CE4B67585EC179BCE4E00E3C09E098C', # Craigs
            address_hex_trunc: '4661FD4469551A3A8CE4B67585EC179BCE4E00E3'.downcase
        }
    })
  end

  it 'Unfollow user 8d07	address(35)' do


    expect(
        ParseDomain.run!(:input => '6a028d07144661fd4469551a3a8ce4b67585ec179bce4e00e3')
    ).to eq ({
        type: 'unfollow',
        obj: {
            address_hex: nil, # '004661FD4469551A3A8CE4B67585EC179BCE4E00E3C09E098C', # Craigs
            address_hex_trunc: '4661FD4469551A3A8CE4B67585EC179BCE4E00E3'.downcase
        }
    })
  end

  it 'Attach picture	8d09	txhash(20), imghash(20), url(34)', skip: true do
    expect(
        ParseDomain.run!(:input => 'OP_RETURN 8d09 fe686b9b2ab589a3cb3368d02211ca1a9b88aa42')
    ).to eq 'notdone'


  end

  it 'Set profile picture	8d10	imghash(16), url(61)', skip: true do
    expect(
        ParseDomain.run!(:input => 'OP_RETURN 8d10 fe686b9b2ab589a3cb3368d02211ca1a9b88aa42')
    ).to eq 'notdone'


  end

  it 'Repost memo	8d11 txhash(20), message(63)	V2', skip: true do
    expect(
        ParseDomain.run!(:input => 'OP_RETURN 8d11 fe686b9b2ab589a3cb3368d02211ca1a9b88aa42')
    ).to eq 'notdone'


  end

  it 'Set profile banner	8d11	imghash(16), url(61)', skip: true do
    expect(
        ParseDomain.run!(:input => 'OP_RETURN 8d11 fe686b9b2ab589a3cb3368d02211ca1a9b88aa42')
    ).to eq 'notdone'


  end

  [
     {
       # Charles: 17R9gr4GUfqVwLriAomJ5RqmTJievnQQ5Z
       #              decoded: 004661FD4469551A3A8CE4B67585EC179BCE4E00E3 C09E098C
       # FOLLOW b:  6a02 6d06 14 4661fd4469551a3a8ce4b67585ec179bce4e00e3
        address: '17R9gr4GUfqVwLriAomJ5RqmTJievnQQ5Z',
        hex:     '004661FD4469551A3A8CE4B67585EC179BCE4E00E3C09E098C',
        hex_trunc: '4661fd4469551a3a8ce4b67585ec179bce4e00e3'
     },
     {
         # CryptoWyren: 12HdPLVwGBeftrAPXoWVQBZrQcqt9srhqi
         # decoded: 000E1D2767F3454783090868A3DE9358AAE4D462B5 282CE831
         # FOLLOW a:  6a02 6d06 14 0e1d2767f3454783090868a3de9358aae4d462b5

        address: '12HdPLVwGBeftrAPXoWVQBZrQcqt9srhqi',
        hex:     '000E1D2767F3454783090868A3DE9358AAE4D462B5282CE831',
        hex_trunc: '0e1d2767f3454783090868a3de9358aae4d462b5'
     },
     {
         # Craig: 1EWnweLyUSB1iz4pqtBmE9ykiz8VReVrGv
         #              decoded: 00943C0C73F7C69379B2E7C325BAD489AC94DA5DA4 662015AF
         # Follow c:  6a02 6d06 14 943c0c73f7c69379b2e7c325bad489ac94da5da4

        address: '1EWnweLyUSB1iz4pqtBmE9ykiz8VReVrGv',
        hex:     '00943C0C73F7C69379B2E7C325BAD489AC94DA5DA4662015AF',
        hex_trunc: '943c0c73f7c69379b2e7c325bad489ac94da5da4'
     }
  ].each do |entry|
    it 'Convert address to address_hex and address_hex_trunc correctly' do

      (hex_version, hex_trunc_version) = BitcoinAddressUtil.get_hex_versions(entry[:address])

      expect(hex_version).to eq entry[:hex].downcase
      expect(hex_trunc_version).to eq entry[:hex_trunc].downcase
    end
  end


end