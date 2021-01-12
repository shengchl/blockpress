class Subs::GetSubBySubName < ActiveInteraction::Base

  string :sub_name

  def execute
    sub = Sub.where(name: @sub_name).first
    sub
  end
end


