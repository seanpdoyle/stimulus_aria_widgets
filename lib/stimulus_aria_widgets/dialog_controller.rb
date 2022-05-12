module StimulusAriaWidgets
  class DialogController < Stimulus::Controller
    tag_name "dialog"

    attributes role: "dialog", aria: { modal: true }
  end
end
