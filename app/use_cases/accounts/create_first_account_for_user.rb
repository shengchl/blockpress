class Accounts::CreateFirstAccountForUser < Mutations::Command

  required do
    integer :user_id
    string :site_name, min_length: 4
  end

  def execute

    user = User.find(inputs[:user_id])

    if user.nil?
      add_error(:user, :invalid_user_id, "The user account is invalid")
      return
    end
    existing_account = Account.find_by_site_name(inputs[:site_name])

    if !existing_account.nil?
      add_error(:account, :business_name_in_use, "That business name is already in use. Use another name instead")
      return
    end
    # Check if the user already  has an account, if they do -- then return that instead
    if !user.account.blank?
      return user.account.first
    end

    account = nil
    Account.transaction do

      account = Account.new(:account_guid => SecureRandom.uuid, :site_name => inputs[:site_name])
      account.save!
      account_manager = AccountManager.new(:user_id => user.id, :account_id => account.id)
      account_manager.save!

    end

    # Attach a default network connection if they just joined
    identity = user.identity.first

    if !identity.nil?
      # This is the page we want to add, now add it
      # If it already exists, then just update the token

      image_url = identity.image.url unless identity.image_file_name.blank?
      imageblob = nil

      if !image_url.blank?
        image_url = URI.parse(image_url.sub("square", "large"))
        image_url.scheme = 'https'
        imageblob = open(image_url.to_s)
      end

      Network::CreateUpdateEnsureAssociationOfNetworkConnection.run!(:network => identity.provider,
                                                                     :network_subtype => 'profile',
                                                                     :uid => identity.uid,
                                                                     :user_id => user.id,
                                                                     :account_id => account.id,
                                                                     :handle => identity.user_name,
                                                                     :token => identity.token,
                                                                     :secret => identity.secret,
                                                                     :image => imageblob)



    end

    account
  end
end


