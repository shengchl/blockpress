require 'rails_helper'
require 'spec_helper'

include Warden::Test::Helpers
Warden.test_mode!

describe ProtocolEntity do
  it 'Set Name decode' do
    entity = ProtocolEntitySetName2.new('8d01','0474657374', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        name: 'test'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Set Name encode' do
    p = ProtocolEntitySetName2.from_entity({
                                              name: 'test'
                                          },
                                          'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '0474657374'
  end

  it 'Set Profile Text decode' do
    entity = ProtocolEntitySetProfileText2.new('8d05', '0474657374', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        text: 'test'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Set Profile Text encode' do
    p = ProtocolEntitySetProfileText2.from_entity({
                                              text: 'test'
                                          },
                                          'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '0474657374'
  end


  it 'Post decode' do
    entity = ProtocolEntityPost2.new('8d02', '0474657374', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        post_body: 'test'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post encode utf8 emoji' do
    p = ProtocolEntityPost2.from_entity({
                                           post_body: '😢😢😱😥😦',
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '14f09f98a2f09f98a2f09f98b1f09f98a5f09f98a6'
  end

  it 'Post encode' do
    p = ProtocolEntityPost2.from_entity({
                                           post_body: 'test'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '0474657374'
  end


  it 'Post community decode' do
    entity = ProtocolEntityPostCommunity2.new('8d11', '07626974636f696e16497320417765736f6d6521', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        community_name: 'bitcoin',
        post_body: 'Is Awesome!'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post community encode' do
    p = ProtocolEntityPostCommunity2.from_entity({
                                           community_name: 'bitcoin',
                                           post_body: 'Is Awesome!'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '07626974636f696e0b497320417765736f6d6521'
  end

  it 'Post community op_return data' do
    p = ProtocolEntityPostCommunity2.from_entity({
                                            community_name: 'bitcoin',
                                            post_body: 'Is Awesome!'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '07626974636f696e0b497320417765736f6d6521'
  end



  it 'Post media decode' do
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)

    entity = ProtocolEntityPostMedia2.new('8d09', "010122#{ipfs_hash_hex}", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        media_payload: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
        post_body: nil,
        media_type: 1,
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)

    entity = ProtocolEntityPostMedia2.new('8d09', "010122#{ipfs_hash_hex}06746573742032", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        media_payload: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
        post_body: 'test 2',
        media_type: 1,
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post media encode' do
    p = ProtocolEntityPostMedia2.from_entity({
                                                   media_type: 1,
                                                   media_payload: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
                                                   post_body: 'test 2'
                                                 },
                                                 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '01012224e24ebb3dc08886ea860de82efe2e107bd0953080a054ca48bf1943aa417432477606746573742032'
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)
    expect(p.payload).to eq "010122#{ipfs_hash_hex}06746573742032"
  end

  it 'Post media http decode' do
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)

    entity = ProtocolEntityPostMedia2.new('8d09', "01011868747470733a2f2f6578616d706c652e636f6d2f6c696e6b", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        media_payload: 'https://example.com/link',
        post_body: nil,
        media_type: 1
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)

    entity = ProtocolEntityPostMedia2.new('8d09', "01011868747470733a2f2f6578616d706c652e636f6d2f6c696e6b06746573742032", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        media_payload: 'https://example.com/link',
        post_body: 'test 2',
        media_type: 1
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post media http encode' do
    p = ProtocolEntityPostMedia2.from_entity({
                                                 media_payload: 'https://example.com/link',
                                                   post_body: 'test 2',
                                                   media_type: 1,
                                               },
                                               'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01011868747470733a2f2f6578616d706c652e636f6d2f6c696e6b06746573742032"
  end



  it 'Attach image http encode check empty' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                   image_link_or_ipfs: 'https://example.com/link',
                                                   caption: '',
                                                   media_type: 'IMAGE',
                                               },
                                               'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01001868747470733a2f2f6578616d706c652e636f6d2f6c696e6b"
  end

  it 'Attach image http encode check nil' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                   image_link_or_ipfs: 'https://example.com/link',
                                                   caption: nil,
                                                   media_type: 'TEXT'
                                               },
                                               'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01021868747470733a2f2f6578616d706c652e636f6d2f6c696e6b"
  end


  it 'Attach image decode' do
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)

    entity = ProtocolEntityAttachMedia2.new('8d09', "22#{ipfs_hash_hex}", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        image_link_or_ipfs: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
        caption: nil
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)

    entity = ProtocolEntityAttachMedia2.new('8d09', "22#{ipfs_hash_hex}06746573742032", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        image_link_or_ipfs: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
        caption: 'test 2'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Attach image encode' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                 media_type: 'IMAGE',
                                                 image_link_or_ipfs: 'QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC',
                                                 caption: 'test 2'
                                             },
                                             'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '01002224e24ebb3dc08886ea860de82efe2e107bd0953080a054ca48bf1943aa417432477606746573742032'
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)
    expect(p.payload).to eq "010022#{ipfs_hash_hex}06746573742032"
  end

  it 'Attach image http decode' do
    ipfs_hash = Base58.base58_to_int('QmXaWRFhu6G6yCcy7dftsiehY8obJmX17hRtZr7BHyCbZC')
    ipfs_hash_hex = ipfs_hash.to_s(16)

    entity = ProtocolEntityAttachMedia2.new('8d09', "01001868747470733a2f2f6578616d706c652e636f6d2f6c696e6b", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        image_link_or_ipfs: 'https://example.com/link',
        caption: nil,
        media_type: 'IMAGE'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)

    entity = ProtocolEntityAttachMedia2.new('8d09', "01001868747470733a2f2f6578616d706c652e636f6d2f6c696e6b06746573742032", 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        image_link_or_ipfs: 'https://example.com/link',
        caption: 'test 2',
        media_type: 'IMAGE'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Attach image http encode' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                 image_link_or_ipfs: 'https://example.com/link',
                                                 caption: 'test 2',
                                                 media_type: 'IMAGE',
                                             },
                                             'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01001868747470733a2f2f6578616d706c652e636f6d2f6c696e6b06746573742032"
  end

  it 'Attach image http encode check empty' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                 image_link_or_ipfs: 'https://example.com/link',
                                                 caption: '',
                                                 media_type: 'IMAGE',
                                             },
                                             'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01001868747470733a2f2f6578616d706c652e636f6d2f6c696e6b"
  end

  it 'Attach image http encode check nil' do
    p = ProtocolEntityAttachMedia2.from_entity({
                                                 image_link_or_ipfs: 'https://example.com/link',
                                                 caption: nil,
                                                 media_type: 'TEXT'
                                             },
                                             'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq "01021868747470733a2f2f6578616d706c652e636f6d2f6c696e6b"
  end

  # Problems
  it 'Post encode and decode newlines' do
    p = ProtocolEntityPost2.from_entity({
                                           post_body: 'test\r\nfoo\nbar\n'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '12746573745c725c6e666f6f5c6e6261725c6e'
    p.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post encode', skip: true do
    p = ProtocolEntityPost2.from_entity({
                                           post_body: 'First postªBitcoin Cash $1984.90 AUDªBCHforEveryone BCH'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.hex).to eq '6a4c398d02466972737420706f7374aa426974636f696e20436173682024313938342e393020415544aa424348666f7245766572796f6e6520424348'
  end

  # Does not populate domain!
  it 'Post decode', skip: true do
    entity = ProtocolEntityPost2.new('6a4c398d02466972737420706f7374aa426974636f696e20436173682024313938342e393020415544aa424348666f7245766572796f6e6520424348', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        post_body: 'First postªBitcoin Cash $1984.90 AUDªBCHforEveryone BCH'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end








  it 'Post reply decode' do
    entity = ProtocolEntityPostReply2.new('8d03', '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864145468616e6b7320666f72207469707072626f7421', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        post_body: 'Thanks for tipprbot!',
        reply_to_tx_id: '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Post reply encode' do
    p = ProtocolEntityPostReply2.from_entity({
                                           post_body: 'Thanks for tipprbot!',
                                           reply_to_tx_id: '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864'
                                       },
                                       'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864145468616e6b7320666f72207469707072626f7421'
  end

  it 'Like decode' do
    entity = ProtocolEntityPostLike2.new('8d04', '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864145468616e6b7320666f72207469707072626f7421', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        # post_body: 'Thanks for tipprbot!',
        reply_to_tx_id: '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864'
    })
    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Like encode' do
    p = ProtocolEntityPostLike2.from_entity({
                                                # post_body: 'Thanks for tipprbot!',
                                                reply_to_tx_id: '2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864'
                                            },
                                            'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '202b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864'
  end

  it 'Set Profile Header decode' do
    entity = ProtocolEntitySetProfileHeader2.new('8d08', '2e516d6550365659596d355568557878745a7352756d5a7152376e4a7756376d6e31566833557159616731516a5658', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        ipfs: 'QmeP6VYYm5UhUxxtZsRumZqR7nJwV7mn1Vh3UqYag1QjVX'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Set Profile Header encode' do
    p = ProtocolEntitySetProfileHeader2.from_entity({
                                                     ipfs: 'QmeP6VYYm5UhUxxtZsRumZqR7nJwV7mn1Vh3UqYag1QjVX'
                                                 },
                                                 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '2e516d6550365659596d355568557878745a7352756d5a7152376e4a7756376d6e31566833557159616731516a5658'
  end

  it 'Set Profile Avatar decode' do
    entity = ProtocolEntitySetProfileAvatar2.new('8d10', '2e516d6550365659596d355568557878745a7352756d5a7152376e4a7756376d6e31566833557159616731516a5658', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        ipfs: 'QmeP6VYYm5UhUxxtZsRumZqR7nJwV7mn1Vh3UqYag1QjVX'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Set Profile Avatar encode' do
    p = ProtocolEntitySetProfileAvatar2.from_entity({
                                                       ipfs: 'QmeP6VYYm5UhUxxtZsRumZqR7nJwV7mn1Vh3UqYag1QjVX'
                                                   },
                                                   'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '2e516d6550365659596d355568557878745a7352756d5a7152376e4a7756376d6e31566833557159616731516a5658'
  end

  it 'Follow decode' do
    entity = ProtocolEntityFollow2.new('8d06', '2231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        follow_address: 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Follow encode' do
    p = ProtocolEntityFollow2.from_entity({
                                             follow_address: 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr'
                                           },
                                                   'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '2231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66'
  end

  it 'Unfollow decode' do
    entity = ProtocolEntityUnfollow2.new('8d07', '2231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66', 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(entity.get_entity).to eq ({
        follow_address: 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr'
    })

    entity.populate_domain!('2b5ea81cd59922692d3e4b3e79a9752cf082d5cba958d1fd0e8fa7c3c4ffd864', 527000, 1524943103)
  end

  it 'Unfollow encode' do
    p = ProtocolEntityUnfollow2.from_entity({
                                               follow_address: 'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr'
                                         },
                                         'qzuu6wxeqf459x63heume84k9uhqqp730czlmdp5mr')
    expect(p.payload).to eq '2231487752725a75705637623435357974626e596d57326f6d72516d654e56747a6d66'
  end

end