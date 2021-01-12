require 'bitcoin'

class Posts::GetPostTipData < ActiveInteraction::Base
  string :action_tx

  def execute

    tip_data =  AddressPostPayOutput.where(:action_tx => action_tx).first

    if tip_data && tip_data.output_value
      return {
          tip_amount: tip_data.output_value,
          address: tip_data.output_address_id
      }
    end
    return {
        tip_amount: 0,
        address: nil
    }
  end
end


