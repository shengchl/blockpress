
def create_omniauth_hash(provider, uid, token, secret = nil, image = nil, nickname = nil, first_name = nil, last_name = nil)

  {
    :provider => provider,
    :uid => uid,
    :info => {
            :name => first_name + ' ' + last_name,
            :first_name => first_name,
            :last_name => last_name,
            :nickname => nickname
    },
    :credentials => {
            :token => token,
            :secret => secret
    }
  }

end