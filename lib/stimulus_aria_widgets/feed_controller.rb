module StimulusAriaWidgets
  class FeedController < Stimulus::Controller
    attributes role: "feed", data: { action: "keydown->feed#navigate" }

    target "article" do
      tag_name "article"
    end
  end
end
