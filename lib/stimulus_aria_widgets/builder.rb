module StimulusAriaWidgets
  Builder = Struct.new :view_context do
    ruby2_keywords def feed(*arguments)
      FeedController.new(view_context, *arguments)
    end

    ruby2_keywords def disclosure(*arguments)
      DisclosureController.new(view_context, *arguments)
    end

    ruby2_keywords def combobox(*arguments)
      ComboboxController.new(view_context, *arguments)
    end

    ruby2_keywords def dialog(*arguments)
      DialogController.new(view_context, *arguments)
    end

    ruby2_keywords def tabs(*arguments)
      TabsController.new(view_context, *arguments)
    end

    ruby2_keywords def grid(*arguments)
      GridController.new(view_context, *arguments)
    end
  end
end
