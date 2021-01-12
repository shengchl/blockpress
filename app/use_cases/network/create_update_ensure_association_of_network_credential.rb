module Network

  class CreateUpdateEnsureAssociationOfNetworkCredential < Mutations::Command

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

      network_credz = NetworkCredential.where(:network => inputs[:network], :uid => inputs[:uid])
      user = User.find(inputs[:user_id])
      # For each network connection, update it if there is a relationship to the user, otherwise destroy it
      network_credz.each do |network_cred|

        if !network_cred.account.managed_by?(user)
          network_cred.destroy!
          next
        end
        network_cred.handle = inputs[:handle]
        network_cred.token = inputs[:token]
        network_cred.secret = inputs[:secret]
        network_cred.connection_ok = 1
        network_cred.save!

      end

      # Verify that the account_id has a network connection, if not, then add it

      if !inputs[:account_id].blank?

        network_cred = NetworkCredential.where(:account_id => inputs[:account_id], :network => inputs[:network], :uid => inputs[:uid]).first

        if network_cred.blank?
          network_cred = NetworkCredential.find_or_initialize_by(:network => inputs[:network], :uid => inputs[:uid], :account_id => inputs[:account_id])

          network_cred.handle = inputs[:handle]
          network_cred.token = inputs[:token]
          network_cred.secret = inputs[:secret]
          network_cred.connection_ok = 1
          network_cred.save!

        end


      end

    end
  end
end