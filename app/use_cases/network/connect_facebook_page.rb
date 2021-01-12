module Network

  class ConnectFacebookPage < Mutations::Command

    required do
      integer :user_id
      integer :account_id
      string :fbpage_id
    end

    def execute

      user = User.find(inputs[:user_id])

      if user.nil?
        add_error(:user, :user_not_found)
        return
      end

      account = Account.find(inputs[:account_id])

      if account.nil?
        add_error(:account, :account_not_found)
        return
      end

      if !user.manages_account?(account)
        add_error(:user, :user_account_permission_error)
        return
      end

      fb = FacebookAuthHelper.new(user)

      fb.get_managed_pages.each do |page|

        if page['id'] == inputs[:fbpage_id]

          # This is the page we want to add, now add it
          # If it already exists, then just update the token
          network_conn = NetworkConnection.find_or_initialize_by(:network => 'facebook', :uid => page['id'], :account_id => account.id)
          network_conn.handle = page['name']
          network_conn.token = page['access_token']
          network_conn.facebook_type = 'page'

          image = page[:avatar] unless page[:avatar].blank?

          if !image.blank?
            image_url = URI.parse(image.sub("square", "large"))
            image_url.scheme = 'https'
            image = image_url.to_s
          end

          network_conn.image = open(image.to_s) unless image.blank?
          network_conn.connection_ok = 1
          network_conn.save!
        end
      end

    end
  end

end