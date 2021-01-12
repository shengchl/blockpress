module Network

  class GetNetworkConnectionsByType < Mutations::Command

    required do
      integer :account_id
      string :type
    end

    def execute
      NetworkConnection.where(:account_id => inputs[:account_id], :network => inputs[:type]).order('id DESC').limit(inputs[:count])
    end
  end

end