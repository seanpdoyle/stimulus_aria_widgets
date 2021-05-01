require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]

  def self.debug!
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  end

  private

  def append(html, into:)
    execute_script <<~JS, html, into
      const [ html, id ] = arguments
      document.getElementById(id).insertAdjacentHTML("beforeend", html)
    JS
  end
end

Capybara.server = :puma, { Silent: true }
