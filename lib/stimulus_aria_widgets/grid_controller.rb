module StimulusAriaWidgets
  class GridController < Stimulus::Controller
    tag_name "table"

    attributes role: "grid"

    target "row" do
      tag_name "tr"

      attributes role: "row", data: { action: "keydown->grid#moveRow" }

      params directions: { ArrowDown: +1, ArrowUp: -1, PageDown: +10, PageUp: -10 }
    end

    target "gridcell" do
      tag_name "td"

      attributes role: "gridcell", data: { action: "focus->grid#captureFocus keydown->grid#moveColumn" }

      params boundaries: { Home: 0, End: 1 }
      params directions: { ArrowRight: +1, ArrowLeft: -1 }
    end
  end
end
