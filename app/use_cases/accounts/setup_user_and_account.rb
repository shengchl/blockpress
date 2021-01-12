class Accounts::SetupUserAndAccount < Mutations::Command

  required do
    integer :user_id
    string :email
    string :password
    string :site_name, min_length: 4
  end


  def execute

    User.transaction do

      user = User.find(inputs[:user_id])

      if user.nil?
        add_error(:user, :invalid_user_id, "The user account is invalid")
        return
      end

      begin

        if user.update!(:email => inputs[:email], :password => inputs[:password])
          user.skip_reconfirmation!
        else
          add_error(:user, :update_error, "An error occurred updating the email and password")
          return
        end

      rescue ActiveRecord::RecordInvalid => e

        # Active record validations failed, propagate them upwards
        e.record.errors.messages.each do |ar_error_key, v|
          add_error(:user, ar_error_key.to_sym, ar_error_key.to_s + ' ' + v.first)
        end

        return
      end

      account_outcome = Accounts::CreateFirstAccountForUser.run(:user_id => user.id, :site_name => inputs[:site_name])

      if !account_outcome.success?
          merge_errors(account_outcome.errors)
      else
         [user, account_outcome.result]
      end

    end
  end
end


