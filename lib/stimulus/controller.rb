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

    def self.target(name, callable = nil, **attributes, &block)
      define_method [ name, :target ].join(separator) do
        attribute = [ identifier, :target ].join(separator)

        overrides = [ callable, block, -> { attributes } ].compact.first.call

        @view_context.tag.attributes(data: { attribute => @view_context.token_list(name) }).merge(overrides)
      end
    end

    def self.classes(*class_names)
      class_names.each { |class_name| allowed_element_data_attributes.add([ class_name, :class ].join(separator)) }
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

    def tag(**options, &block)
      if options.any? || block.present?
        attributes.with_attributes(**options).content_tag(default_tag_name, &block)
      else
        attributes.tag
      end
    end
  end
end
