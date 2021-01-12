class Wallets::GetCurrentMaxHeight < ActiveInteraction::Base

  def execute
    BchTransaction.max(:block_id)
  end
end


