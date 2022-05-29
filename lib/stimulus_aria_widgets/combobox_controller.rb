module StimulusAriaWidgets
  class ComboboxController < Stimulus::Controller
    attributes data: { action: "input->combobox#expand" }

    target "combobox", role: "combobox", autocomplete: "off",
                       data: { action: "keydown->combobox#navigate" }
    target "listbox", role: "listbox"
    target "option", role: "option", tabindex: "-1"
  end
end
