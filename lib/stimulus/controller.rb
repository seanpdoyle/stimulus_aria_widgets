module Stimulus
  class Controller
    class_attribute :separator, default: "_"
    class_attribute :element_attributes, default: {}
    class_attribute :allowed_element_data_attributes, default: Set.new
    class_attribute :default_tag_name, default: "div"

    delegate_missing_to :attributes

    def self.tag_name(tag_name)
      self.default_tag_name = tag_name
    end

    def self.attributes(**attributes)
      self.element_attributes = element_attributes.merge attributes
    end

    def self.target(name, **overrides, &block)
      define_method [ name, :target ].join(separator) do
        Target.new(name, @view_context, self, &block).tap do |target|
          target.attributes(**overrides)

          if block.present?
            target.instance_exec(&block)
          end
        end
      end
    end

    def self.classes(*class_names)
      class_names.each { |class_name| allowed_element_data_attributes.add([ class_name, :class ].join(separator)) }
    end

    def self.values(*values)
      values.each { |value| allowed_element_data_attributes.add([ value, :value ].join(separator)) }
    end

    def self.identifier
      name.demodulize.underscore.delete_suffix "_controller"
    end

    def initialize(view_context, **element_data_attributes)
      @view_context = view_context
      @element_data_attributes = element_data_attributes.with_indifferent_access.slice(*allowed_element_data_attributes).transform_keys { |key| [ identifier, key ].join(separator) }
    end

    def identifier
      self.class.identifier
    end

    def attributes
      @view_context.tag.attributes(data: { controller: identifier })
        .merge(element_attributes)
        .merge(data: @element_data_attributes)
    end

    ruby2_keywords def tag(*arguments, &block)
      options = arguments.extract_options!

      if arguments.any? || options.any? || block.present?
        if arguments.any?
          attributes.with_attributes(**options).content_tag(default_tag_name, *arguments)
        else
          attributes.with_attributes(**options).content_tag(default_tag_name) do
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
