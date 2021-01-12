class Users::IncrementBadgeCountsForFollowers < ActiveInteraction::Base

  string :address

  def execute
    return

    # Consider this later
      User.transaction do
        address_ids.each do |address|
          user = User.find_by_address_cash(address)
          user.badge_count = user.badge_count + 1
          user.save
        end
      end
  end
end


