module StimulusAriaWidgets
  class ComboboxController < Stimulus::Controller
    attributes data: { action: "input->combobox#expand" }

    target "combobox", -> { { role: "combobox", data: { action: "keydown->combobox#navigate" } } }
    target "listbox", -> { { role: "listbox" } }
    target "option", -> { { role: "option" } }
  end
end
