module ApplicationHelper

  def sub_string(name)
    "/b/#{name}"
  end

  def user_string(name)
    "/@#{name}"
  end

  def post_title_link(post)
    if post.is_link
      link_to post.title, post.link_url, class: 'no-underline'
    else
      link_to post.title, show_sub_post_path(post.sub.name, post.unique_key), class: 'no-underline'
    end
  end
  def post_title_link_string(post)
    if post.is_link
      post.link_url
    else
      show_sub_post_path(post.sub.name, post.unique_key)
    end
  end

  def post_has_unpublished_draft(post)
    return post.has_draft == 1 && post.is_created == 1
  end
end
