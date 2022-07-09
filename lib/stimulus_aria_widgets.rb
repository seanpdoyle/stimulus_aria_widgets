require "zeitwerk"
loader = Zeitwerk::Loader.for_gem(warn_on_extra_files: false)
loader.setup

module StimulusAriaWidgets
  # Your code goes here...
end

loader.eager_load
