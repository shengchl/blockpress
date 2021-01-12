require 'rails_helper'
require 'spec_helper'

include Warden::Test::Helpers
Warden.test_mode!

describe ProtocolParserFactory do

  [
      { hex: '174c657427732074616c6b2061626f757420546563686e6f04f09fa780', params: [ ProtocolParserFactory.utf8_to_hex('Let\'s talk about Techno'), ProtocolParserFactory.utf8_to_hex('🧀') ] },
      { hex: '3b486973746f7279206f6620426974636f696e2075706772616465732068747470733a2f2f692e696d6775722e636f6d2f6f6556653353382e676966', params: [ ProtocolParserFactory.utf8_to_hex('History of Bitcoin upgrades https://i.imgur.com/oeVe3S8.gif') ] },
      { hex: '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864145468616e6b7320666f72207469707072626f7421', params: [ '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', ProtocolParserFactory.utf8_to_hex('Thanks for tipprbot!') ] },
      { hex: '13e8b0a22ce0a4b0e0a581e0a4aae0a4afe0a4be0474657374', params: [ ProtocolParserFactory.utf8_to_hex("谢,रुपया"), ProtocolParserFactory.utf8_to_hex('test') ] },
      { hex: '20f09f988af09f988cf09f8da0e29bb3efb88ff09f9aa0f09f939ee29da4efb88f', params: [ProtocolParserFactory.utf8_to_hex("😊😌🍠⛳️🚠📞❤️")] },
      { hex: '4c4d54686520717569636b2062726f776e20666f78206a756d706564206f7665722076657279206c617a7920646f672e2e205468656e2068652077656e7420746f20677261622068697320626f6e65', params: [ProtocolParserFactory.utf8_to_hex('The quick brown fox jumped over very lazy dog.. Then he went to grab his bone')] },
      # The quick brown fox jumped over very lazy dog.. Then he went to grab his bone (2 params)
      { hex: '2f54686520717569636b2062726f776e20666f78206a756d706564206f7665722076657279206c617a7920646f672e2e1e205468656e2068652077656e7420746f20677261622068697320626f6e65', params: [ProtocolParserFactory.utf8_to_hex('The quick brown fox jumped over very lazy dog..'), ProtocolParserFactory.utf8_to_hex(' Then he went to grab his bone')] },
      { hex: '083132333435363738083132333435363738', params: [ProtocolParserFactory.bin_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '0831323334353637380c313233343132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('123412345678')] },
      { hex: '083132333435363738083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '047465737406746573742032', params: [ProtocolParserFactory.utf8_to_hex('test'), ProtocolParserFactory.utf8_to_hex('test 2')] },
  ].each do |record|

    it "gets params array #{record[:hex]}" do
      params = ProtocolParserFactory::get_params_array(record[:hex])
      puts record[:params]
      expect(params).to eq record[:params]
    end
  end

  [
      { hex: '174c657427732074616c6b2061626f757420546563686e6f04f09fa780', params: [ ProtocolParserFactory.utf8_to_hex('Let\'s talk about Techno'), ProtocolParserFactory.utf8_to_hex('🧀') ] },
      { hex: '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864145468616e6b7320666f72207469707072626f7421', params: [ '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', ProtocolParserFactory.utf8_to_hex('Thanks for tipprbot!') ] },
      { hex: '13e8b0a22ce0a4b0e0a581e0a4aae0a4afe0a4be0474657374', params: [ ProtocolParserFactory.utf8_to_hex("谢,रुपया"), ProtocolParserFactory.utf8_to_hex('test') ] },
      { hex: '20f09f988af09f988cf09f8da0e29bb3efb88ff09f9aa0f09f939ee29da4efb88f', params: [ProtocolParserFactory.utf8_to_hex("😊😌🍠⛳️🚠📞❤️")] },
      { hex: '4c4d54686520717569636b2062726f776e20666f78206a756d706564206f7665722076657279206c617a7920646f672e2e205468656e2068652077656e7420746f20677261622068697320626f6e65', params: [ProtocolParserFactory.utf8_to_hex('The quick brown fox jumped over very lazy dog.. Then he went to grab his bone')] },
      # The quick brown fox jumped over very lazy dog.. Then he went to grab his bone (2 params)
      { hex: '2f54686520717569636b2062726f776e20666f78206a756d706564206f7665722076657279206c617a7920646f672e2e1e205468656e2068652077656e7420746f20677261622068697320626f6e65', params: [ProtocolParserFactory.utf8_to_hex('The quick brown fox jumped over very lazy dog..'), ProtocolParserFactory.utf8_to_hex(' Then he went to grab his bone')] },
      { hex: '083132333435363738083132333435363738', params: [ProtocolParserFactory.bin_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '0831323334353637380c313233343132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('123412345678')] },
      { hex: '083132333435363738083132333435363738', params: [ProtocolParserFactory.utf8_to_hex('12345678'), ProtocolParserFactory.utf8_to_hex('12345678')] },
      { hex: '047465737406746573742032', params: [ProtocolParserFactory.utf8_to_hex('test'), ProtocolParserFactory.utf8_to_hex('test 2')] },
  ].each do |record|
    it "get hex from params array #{record[:hex]}" do
      hex = ProtocolParserFactory::hex_params_to_hex_payload(record[:params])
      expect(hex).to eq record[:hex]
    end
  end


  it 'Set Name create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d010474657374', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntitySetName2)
    expect(entity.hex).to eq '6a028d010474657374'
    expect(entity.created_by_address).to eq 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr'
  end

  it 'Post create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d0206746573742032', 'bitcoincash:qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.hex).to eq '6a028d0206746573742032'
    expect(entity).to be_instance_of(ProtocolEntityPost2)
  end

  it 'Post media create_entity' do
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)
    entity = ProtocolParserFactory.create_entity("6a028d09010122#{ipfs_hash}", 'bitcoincash:qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.hex).to eq "6a028d09010122#{ipfs_hash}"
    expect(entity).to be_instance_of(ProtocolEntityPostMedia2)

    entity = ProtocolParserFactory.create_entity("6a028d09010122#{ipfs_hash}06746573742032", 'bitcoincash:qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.hex).to eq "6a028d09010122#{ipfs_hash}06746573742032"
    expect(entity).to be_instance_of(ProtocolEntityPostMedia2)
  end

  it 'Post Community create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d110474657374203204746573742032', 'bitcoincash:qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntityPostCommunity2)
  end

  it 'Set Profile Text create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d0506746573742032', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntitySetProfileText2)
  end

  it 'Set Profile Header create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d0804746573742032', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntitySetProfileHeader2)
  end

  it 'Set Profile Avatar create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d1004746573742032', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntitySetProfileAvatar2)
  end

  it 'Follow create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d062231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntityFollow2)
  end

  it 'Unfollow create_entity' do                    #        fe686b9b2ab589a3cb3368d02211ca1a9b88aa42
    entity = ProtocolParserFactory.create_entity('6a028d072231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntityUnfollow2)
  end

  it 'Like create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d0420fe32a4bc5a52ce9b861725462ad7d5d223d3554532eb172c7d29feca5722d44c145468616e6b7320666f72207469707072626f7421', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntityPostLike2)
  end

  it 'Reply create_entity' do
    entity = ProtocolParserFactory.create_entity('6a028d0320fe32a4bc5a52ce9b861725462ad7d5d223d3554532eb172c7d29feca5722d44c145468616e6b7320666f72207469707072626f7421', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity).to be_instance_of(ProtocolEntityPostReply2)
  end
end