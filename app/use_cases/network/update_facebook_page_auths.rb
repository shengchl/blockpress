module Network

  # Update all facebook page network connections that are owned/managed by the user
  # We do this after a user has already attached a facebook page as a network connection
  # Since the user will not go out of their way to 'reconnect' a facebook page just for kicks.... we do it everytime the user logs in
  class UpdateFacebookPageAuths < Mutations::Command

    required do
      integer :user_id
    end

    def execute

      user = User.find(inputs[:user_id])
      accounts = user.account
      network_conns = []

      accounts.each do |account|
        # Does this account have a network connection for the given page?
        network_conns = NetworkConnection.where(:account_id => account.id, :network => 'facebook', :facebook_type => 'page')
      end

      # If there is at least one facebook page network connection, then cross reference
      # to see whether we should update access tokens
      if !network_conns.blank?

        fb_auth = FacebookAuthHelper.new(user)
        pages = fb_auth.get_managed_pages

        pages_hash = Hash[pages.map { |u| [u['id'], u] }]

        network_conns.each do |network_conn|

          if !pages_hash[network_conn.uid].blank?
            network_conn.token = pages_hash[network_conn.uid]['access_token']
            network_conn.save!
          end
        end

      end
    end
  end
end