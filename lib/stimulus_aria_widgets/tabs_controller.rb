module StimulusAriaWidgets
  class TabsController < Stimulus::Controller
    values "defer_selection"

    target "tablist", role: "tablist", data: { action: "keydown->tabs#navigate" }
    target "tab", role: "tab", data: { action: "focus->tabs#isolateFocus click->tabs#select" }
    target "tabpanel", role: "tabpanel"
  end
end
