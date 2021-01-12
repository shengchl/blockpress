module Network

  class DeleteNetworkConnection < Mutations::Command

    required do
      integer :account_id
      integer :network_connection_id
    end

    def execute
      nc = NetworkConnection.where(:account_id => inputs[:account_id], :id => inputs[:network_connection_id]).first

      if nc.nil?
        add_error(:network, :network_connection_not_found)
        return
      end
      nc.destroy!
    end
  end

end