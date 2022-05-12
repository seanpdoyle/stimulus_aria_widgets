module Stimulus
  class Target
    class_attribute :separator, default: "_"

    delegate_missing_to :attributes

    def initialize(name, view_context, controller, default_tag_name = "div")
      @name = name
      @view_context = view_context
      @controller = controller
      @default_tag_name = default_tag_name
      @attributes = @view_context.tag.attributes
      @params = HashWithIndifferentAccess.new
    end

    def tag_name(tag_name)
      @default_tag_name = tag_name
    end

    def attributes(**defaults)
      if defaults.present?
        @attributes.deep_merge!(defaults)
      else
        attribute = [ @controller.identifier, :target ].join(separator)
        token_list = @view_context.token_list(@name)

        @attributes.deep_merge(data: { attribute => token_list, **params })
      end
    end

    def params(**defaults)
      if defaults.present?
        @params.deep_merge!(defaults)
      else
        @params.transform_keys { |key| [ @controller.identifier, key, :param ].join(separator) }
      end
    end

    ruby2_keywords def tag(*arguments, &block)
      options = arguments.extract_options!

      if arguments.any? || options.any? || block.present?
        if arguments.any?
          attributes.with_attributes(**options).content_tag(@default_tag_name, *arguments)
        else
          attributes.with_attributes(**options).content_tag(@default_tag_name) do
            @view_context.capture { yield_self(&block) }
          end
        end
      else
        DelegatorWithClosure.new(attributes.tag) do |closure|
          @view_context.capture { yield_self(&closure) }
        end
      end
    end

    def to_s
      attributes.to_s
    end
  end
end
