require 'bitcoin'

class Posts::GetCommunities < ActiveInteraction::Base
  integer :offset_id, default: 0
  def execute

    posts_with_comm = AddressPost.where('community IS NOT NULL').order(:created_at => :desc).all
    comms = []
    posts_with_comm.each do |post|
      if post.community.blank?
        next
      end
      comms << post.community
    end

    uniqs = comms.uniq
    result_comms_data = []

    uniqs.each do |comm|

      latest_post = AddressPost.where('community = ?', comm).maximum(:created_at)
      result_comms_data << {
        name: comm,
        posts: AddressPost.where('community = ?', comm).all.count,
        recentPostAt: latest_post.to_i
      }
    end

    return result_comms_data
  end
end


