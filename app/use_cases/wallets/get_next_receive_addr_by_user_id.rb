class Wallets::GetNextReceiveAddrByUserId < ActiveInteraction::Base

  integer :user_id

  def execute
    user = User.find_by_id(@user_id)
    account = user.account.first
    seed = BipMnemonic.to_seed(mnemonic: account.wallet_phrase)
    master = MoneyTree::Master.new seed_hex: seed
    receive_addr = ReceiveAddr.order(child_node_i: :desc).where(:account_id => account.id).first

    if (!receive_addr)
      node = master.node_for_path "m/0/0"
      child_address = node.to_address
      @receive = ReceiveAddr.create(:account_id => account.id,
                                    :child_node_i => 0,
                                    :uid => SecureRandom.uuid,
                                    :address => child_address)
    else
      ReceiveAddr.transaction do
        next_child_node_i = receive_addr.child_node_i + 1
        node = master.node_for_path("m/0/" + next_child_node_i.to_s)
        child_address = node.to_address
        @receive = ReceiveAddr.create(:account_id => account.id,
                                      :child_node_i => next_child_node_i,
                                      :uid => SecureRandom.uuid,
                                      :address => child_address)
      end
    end

    @receive.address
  end
end


