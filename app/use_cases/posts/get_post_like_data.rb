require 'bitcoin'

class Posts::GetPostLikeData < ActiveInteraction::Base
  string :action_tx

  def execute

    count_likes =  AddressPost.where(:reply_to_tx_id => action_tx, :is_like => 1)

    total_likes = {}
    count_likes.each do |k|
      total_likes[k.address_id] = 1
    end

    query = "SELECT sum(address_post_pay_outputs.output_value) as tips from address_post_pay_outputs, address_posts WHERE address_posts.reply_to_tx_id = '#{action_tx}' AND address_posts.action_tx = address_post_pay_outputs.action_tx"
    results = ActiveRecord::Base.connection.execute(query)

    tips = 0
    results.each do |row|
      tips = row[0].to_i unless row[0].blank?
    end

    replies =  AddressPost.where(:reply_to_tx_id => action_tx, :is_like => 0).count

    {
        likes: total_likes.size,
        tips: tips,
        replies: replies
    }
  end
end


