module Network

  class PublishPost < Mutations::Command

    required do
      integer :post_id
    end

    def execute

      post_id = inputs[:post_id]
      api_proxy_factory = ApiProxyFactory.new
      post_publisher = PostPublisher.new(Post.find(post_id), api_proxy_factory)
      post_publisher.publish!

    end

  end
end