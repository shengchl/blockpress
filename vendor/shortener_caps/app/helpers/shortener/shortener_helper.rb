module Shortener::ShortenerHelper

  # generate a url from a url string
  def short_url(url, owner=nil)
    short_url = Shortener::ShortenedUrl.generate(url, owner)
    short_url ? url_for(:controller => :"shortener/shortened_urls", :action => :show, :id => short_url.unique_key, :only_path => false) : url
  end
  # generate a url from a url string
  def short_url_with_host(url, owner=nil, host=nil)
    short_url = Shortener::ShortenedUrl.generate(url, owner)

    if host.blank?
      short_url ? url_for(:controller => :"shortener/shortened_urls", :action => :show, :id => short_url.unique_key, :only_path => false) : url
    else
      short_url ? url_for(:host => host, :controller => :"shortener/shortened_urls", :action => :show, :id => short_url.unique_key, :only_path => false) : url
    end
  end

end
