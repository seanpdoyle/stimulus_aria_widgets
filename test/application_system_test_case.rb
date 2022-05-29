require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]

  def self.debug!
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  end

  private

  def tab_until_focused(*arguments, **options, &block)
    using_wait_time false do
      send_keys(:tab) until page.has_selector?(*arguments, **options, focused: true, &block)
    end
  end

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

Capybara.add_selector :gridcell do
  xpath do |locator|
    td = XPath.descendant(:td)

    locator.nil? ? td : td[XPath.n.string.is(locator)]
  end

  node_filter :column do |td, column|
    table = td.find :xpath, "./ancestor::table"
    row = td.find :xpath, "./ancestor::tr"
    index = row.all("td").map(&:path).index(td.path)

    table.has_selector?("th:nth-child(#{index + 1})", text: column) ||
      row.has_selector?("th[scope=row]", text: column)
  end
end
