module StimulusAriaWidgets
  class FeedController < Stimulus::Controller
    attributes role: "feed", data: { action: "keydown->feed#navigate" }
  end
end
