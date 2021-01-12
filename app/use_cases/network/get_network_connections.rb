module Network

  class GetNetworkConnections < Mutations::Command

    required do
      integer :account_id
    end

    def execute
      NetworkConnection.where(:account_id => inputs[:account_id]).order('id ASC')
    end
  end

end