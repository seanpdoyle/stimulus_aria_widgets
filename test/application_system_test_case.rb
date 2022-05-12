require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]

  def self.debug!
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  end

  private

  def append(erb, into:, locals: {})
    html = ApplicationController.renderer.render(inline: erb, locals: locals)

    execute_script <<~JS, html, into
      const [ html, id ] = arguments
      document.getElementById(id).insertAdjacentHTML("beforeend", html)
    JS
  end

  def remove(id)
    execute_script <<~JS, id
      const [ id ] = arguments
      document.getElementById(id).remove()
    JS
  end
end

Capybara.server = :puma, { Silent: true }
