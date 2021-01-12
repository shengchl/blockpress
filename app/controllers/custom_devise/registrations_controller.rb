class CustomDevise::RegistrationsController < Devise::RegistrationsController
  layout 'registrations'
  after_filter :add_account

  protected

  def add_account
    if resource.persisted? # user is created successfully

      wif = nil
      address_legacy = nil

      if !params[:user][:wif].blank?
        address = MoneyTree::Address.new(private_key: params[:user][:wif], compressed: false)
        wif = params[:user][:wif]
        address_legacy = address.to_s
      else
        phrase = BipMnemonic.to_mnemonic(bits: 128)
        seed = BipMnemonic.to_seed(mnemonic: phrase)
        master = MoneyTree::Master.new seed_hex: seed
        # masterxpub = master.to_bip32
        node = master.node_for_path "m/0/0"
        address_legacy = node.to_address
        wif = node.private_key.to_wif
      end

      cashaddr = Cashaddress.from_legacy(address_legacy).gsub('bitcoincash:', '')
      (hex, hex_trunc) = BitcoinAddressUtil.get_hex_versions(address_legacy)

      resource.update(:wallet_phrase => phrase,
                      :wif => wif,
                      :address_cash => cashaddr,
                      :address_legacy => address_legacy,
                      :address_legacy_hex => hex)

      AddressIdent.find_or_create_by!(:address_id => cashaddr)

    end
  end

  def after_sign_up_path_for(resource)
    if (Rails.env.production?)
      'https://www.blockpress.com'
    else
      'http://localhost:4200'
    end
  end

  def sign_up_params
    params.require(:user).permit(:username, :password, :wif, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:username, :password, :wif, :password_confirmation, :current_password)
  end

end