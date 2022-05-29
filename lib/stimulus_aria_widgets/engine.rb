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

    initializer "stimulus_aria_widgets.assets" do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.precompile += %w(
          stimulus_aria_widgets.js
          stimulus_aria_widgets/polyfills.js
        )
      end
    end
  end
end
