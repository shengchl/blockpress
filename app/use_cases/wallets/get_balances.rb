class Wallets::GetBalances < ActiveInteraction::Base

  string :address_id

  def execute
    balances = BitcoinRpcService.get_balance(Cashaddress.to_legacy('bitcoincash:' + address_id))


    insufficient_funds = true
    if balances['confirmed'] + balances['unconfirmed'] >= 800
      insufficient_funds = false
    end
    {
        confirmedBalance: balances['confirmed'],
        unconfirmedBalance: balances['unconfirmed'],
        insufficientFunds: insufficient_funds
    }
  end
end


