module StimulusAriaWidgets
  class DialogController < Stimulus::Controller
    attributes role: "dialog", aria: { modal: true }
  end
end
