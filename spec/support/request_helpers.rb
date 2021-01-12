module Requests
  module JsonHelpers
    def json
      @json = JSON.parse(response.body, :symbolize_names => true)
    end
    def headers_json_type
      { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' }
    end
  end

end
