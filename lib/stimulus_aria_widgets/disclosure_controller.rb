module StimulusAriaWidgets
  class DisclosureController < Stimulus::Controller
    attributes type: "button", data: { action: "click->disclosure#toggle" }

    classes "expanded"
  end
end
