class Subs::GetSubBySubId < ActiveInteraction::Base

  string :sub_id

  def execute
    sub = Sub.find_by_id(@sub_id)
    sub
  end
end


