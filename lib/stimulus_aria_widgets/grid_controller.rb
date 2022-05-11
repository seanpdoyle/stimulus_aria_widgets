module StimulusAriaWidgets
  class GridController < Stimulus::Controller
    tag_name "table"

    attributes role: "grid"

    target "row", role: "row", data: {
      action: "keydown->grid#moveRow",
      grid_directions_param: { ArrowDown: +1, ArrowUp: -1, PageDown: +10, PageUp: -10 },
    }
    target "gridcell", role: "gridcell", data: {
      action: "focus->grid#captureFocus keydown->grid#moveColumn",
      grid_boundaries_param: { Home: 0, End: 1 },
      grid_directions_param: { ArrowRight: +1, ArrowLeft: -1 },
    }
  end
end
