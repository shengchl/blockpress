class SubdomainPaths

  def self.construct_path(subdomain, path = nil)

    if path.nil?
      'http://' + subdomain + '.' + 'lvh.me:3000'
    else
      'http://' + subdomain + '.' + 'lvh.me:3000/' + path
    end

  end
end