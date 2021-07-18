module StimulusAriaWidgets
  class Engine < ::Rails::Engine
    config.stimulus_aria_widgets = ActiveSupport::OrderedOptions.new
    config.stimulus_aria_widgets.helper_method = :aria

    config.to_prepare do
      ApplicationController.helper Module.new do
        define_method Rails.application.config.stimulus_aria_widgets.helper_method do
          StimulusAriaWidgets::Builder.new(self)
        end
      end
    end
  end
end
