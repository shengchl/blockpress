Rails.application.routes.draw do
  devise_for :users,
             :controllers => {:registrations => 'custom_devise/registrations', :sessions => 'custom_devise/sessions'}

  get "/users", to: "users#index", as: 'redirect_users_to_reg'

  get "/api/sessions", to: "users#sessions", as: "sessions"
  post "/api/sessions/export", to: "users#export_key", as: "sessions_export_key"
  get "/api/sessions/logout", to: "users#logout", as: "logout"
  get "/api/sessions/balance", to: "users#balance", as: 'session_balance'

  # Profile
  get "/api/profiles/active", to: "profiles#profile_active", as: "profile_active"
  get "/api/profiles/search", to: "profiles#profile_search", as: "profile_info_search"
  get "/api/profiles/:address", to: "profiles#profile_info_deprecated", as: "profile_info_deprecated"
  get "/api/profiles/:address/basic", to: "profiles#profile_basic_info", as: "profile_basic_info"
  get "/api/profiles/:address/extended", to: "profiles#profile_info", as: "profile_info"
  get "/api/profiles/:address/likes", to: "profiles#likes", as: "profile_likes"
  get "/api/profiles/:address/followers", to: "profiles#followers", as: "profile_followers"
  get "/api/profiles/:address/following", to: "profiles#following", as: "profile_following"

  # Profile updates
  post "/api/profiles/name", to: "profiles#update_profile_name", as: "update_profile_name"
  post "/api/profiles/avatar", to: "profiles#update_profile_avatar", as: "update_profile_avatar"
  post "/api/profiles/bio", to: "profiles#update_profile_bio", as: "update_profile_bio"
  post "/api/profiles/header", to: "profiles#update_profile_header", as: "update_profile_header"
  post "/api/profiles/following/:address", to: "profiles#profile_follow_user", as: "profile_follow_user"
  delete "/api/profiles/following/:address", to: "profiles#profile_unfollow_user", as: "profile_unfollow_user"

  # Communities
  get "/api/communities/index", to: "posts#get_communities", as: "get_communities"
  get "/api/posts/communities/query", to: "posts#get_community_posts", as: "get_community_posts_query"
  get "/api/posts/communities/:community_name/index", to: "posts#get_community_posts", as: "get_community_posts"

  # Posts
  get "/api/posts/replies/index", to: "posts#get_reply_feed", as: "get_reply_feed"
  get "/api/posts/top/index", to: "posts#top", as: "top_posts"
  get "/api/posts/feed/index", to: "posts#feed", as: "feed_posts"
  get "/api/posts/search/hashtag/:hashtag", to: "posts#search", as: "search_posts"
  get "/api/posts/profiles/:address_id/index", to: "posts#profile_posts", as: "profile_posts"

  get "/api/posts/tx/:tx_id", to: "posts#single_post", as: "single_post"
  post "/api/posts", to: "posts#create_post", as: "create_post"
  post "/api/posts/tx/:tx_id", to: "posts#repost_post", as: "repost_post"

  # Notifications
  get "/api/notifications/index", to: "posts#get_notifications", as: "get_notifications"

  # Post replies
  get "/api/posts/tx/:tx_id/replies", to: "posts#get_replies", as: "get_replies"
  post "/api/posts/tx/:tx_id/replies", to: "posts#create_reply", as: "create_reply"

  # Post likes
  get "/api/posts/tx/:tx_id/likes", to: "posts#likes", as: "post_likes"
  post "/api/posts/tx/:tx_id/likes", to: "posts#create_like", as: "create_like"

  # Post photos
  get "/api/posts/tx/:tx_id/photos", to: "posts#photos", as: "post_photos"
  post "/api/posts/tx/:tx_id/photos", to: "posts#attach_photo", as: "attach_photo"

  root to: 'home#index'
end
