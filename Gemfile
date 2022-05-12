source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in stimulus_aria_widgets.gemspec.
gemspec

rails_version = ENV.fetch("RAILS_VERSION", "7.0")

if rails_version == "main"
  rails_constraint = { github: "rails/rails" }
else
  rails_constraint = "~> #{rails_version}.0"
end

gem "rails", rails_constraint
gem "sprockets-rails"

gem "puma"
gem "rexml"
gem "sqlite3"
gem "action_view-attributes_and_token_lists", github: "seanpdoyle/action_view-attributes_and_token_lists", branch: "main"

group :test do
  gem "capybara"
  gem "capybara_accessible_selectors", github: "citizensadvice/capybara_accessible_selectors", branch: "main"
  gem "selenium-webdriver"
  gem "webdrivers"
end

# To use a debugger
# gem 'byebug', group: [:development, :test]
