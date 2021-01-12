module Network

  class GetFacebookPages < Mutations::Command

    required do
      integer :user_id
    end

    def execute

      user = User.find(inputs[:user_id])

      if user.nil?
        add_error(:user, :user_not_found)
        return
      end

      fb = FacebookAuthHelper.new(user)
      fb.get_managed_pages
    end
  end

end