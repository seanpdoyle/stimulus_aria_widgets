module StimulusAriaWidgets
  class DisclosureController < Stimulus::Controller
    tag_name "button"

    attributes type: "button", data: { action: "click->disclosure#toggle" }

    classes "expanded"
  end
end
