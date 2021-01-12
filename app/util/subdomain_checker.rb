class SubdomainChecker
  def self.matches?(request)
    if request.subdomain.present?
      case request.subdomain
        when 'www', 'api', 'ftp', 'site', 'help', 'blog', 'info', 'support', 'admin', 'root'
          return false
        else
          return true
      end
    end
    return false
  end
end