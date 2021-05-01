require_relative "lib/stimulus_aria_widgets/version"

Gem::Specification.new do |spec|
  spec.name        = "stimulus_aria_widgets"
  spec.version     = StimulusAriaWidgets::VERSION
  spec.authors     = ["Sean Doyle"]
  spec.email       = ["sean.p.doyle24@gmail.com"]
  spec.homepage    = "https://github.com/seanpdoyle/stimulus_aria_widgets"
  spec.summary     = "Stimulus controllers to implement keyboard interactions for ARIA patterns"
  spec.description = spec.summary
  spec.license     = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "https://github.com/seanpdoyle/stimulus_aria_widgets/blob/main/CHANGELOG.md"

  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", ">= 6.1.3.1"
  spec.add_dependency "ruby2_keywords"
  spec.add_dependency "zeitwerk"
end
