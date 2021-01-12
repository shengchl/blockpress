module Network

  class CreateUpdateEnsureAssociationOfNetworkConnection < Mutations::Command

    required do
      string :network
      string :network_subtype # profile, page, etc
      string :uid
      integer :user_id
      string :handle
      string :token
    end
    optional do
      string :secret, empty: true
      integer :account_id, empty: true
      file :image, empty: true
    end

    def execute

      network_conns = NetworkConnection.where(:network => inputs[:network], :uid => inputs[:uid])
      user = User.find(inputs[:user_id])
      # For each network connection, update it if there is a relationship to the user, otherwise destroy it
      network_conns.each do |network_conn|

        if !network_conn.account.managed_by?(user)
          network_conn.destroy!
          next
        end
        network_conn.handle = inputs[:handle]
        network_conn.token = inputs[:token]
        network_conn.secret = inputs[:secret]

        if inputs[:network] == 'facebook'
          network_conn.facebook_type = inputs[:network_subtype]
          network_conn.twitter_type = nil
        elsif inputs[:network] == 'twitter'
          network_conn.twitter_type = inputs[:network_subtype]
          network_conn.facebook_type = nil
        end

        network_conn.image = image unless inputs[:image].blank?
        network_conn.connection_ok = 1
        network_conn.save!

      end

      # Verify that the account_id has a network connection, if not, then add it

      if !inputs[:account_id].blank?

        network_conns_for_account = NetworkConnection.where(:account_id => inputs[:account_id], :network => inputs[:network], :uid => inputs[:uid])

        if network_conns_for_account.blank?
          network_conn = NetworkConnection.find_or_initialize_by(:network => inputs[:network], :uid => inputs[:uid], :account_id => inputs[:account_id])

          network_conn.handle = inputs[:handle]
          network_conn.token = inputs[:token]
          network_conn.secret = inputs[:secret]

          if inputs[:network] == 'facebook'
            network_conn.facebook_type = inputs[:network_subtype]
            network_conn.twitter_type = nil
          elsif inputs[:network] == 'twitter'
            network_conn.twitter_type = inputs[:network_subtype]
            network_conn.facebook_type = nil
          end

          network_conn.image = image unless inputs[:image].blank?
          network_conn.connection_ok = 1
          network_conn.save!

        end

      end

    end
  end
end