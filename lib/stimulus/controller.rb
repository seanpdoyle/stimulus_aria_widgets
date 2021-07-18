module Stimulus
  class Controller
    class_attribute :separator, default: "_"
    class_attribute :element_attributes, default: {}
    class_attribute :allowed_element_data_attributes, default: Set.new

    delegate_missing_to :attributes

    def self.attributes(**attributes)
      self.element_attributes = element_attributes.merge attributes
    end

    def self.target(name, callable = nil, &block)
      method_name = name.to_s.delete_suffix "_target"

      define_method [ method_name, :target ].join(separator) do
        attribute = [ identifier, :target ].join(separator)

        overrides = [ callable, block, -> { {} } ].detect(&:present?).call

        @view_context.tag.attributes(data: { attribute => @view_context.token_list(name) }).merge(overrides)
      end
    end

    def self.classes(*class_names)
      class_names.each { |class_name| allowed_element_data_attributes.add([ class_name, :class ].join(separator)) }
    end

    def self.identifier
      self.name.demodulize.underscore.delete_suffix "_controller"
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
  end
end
