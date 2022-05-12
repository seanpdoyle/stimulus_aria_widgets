require "application_system_test_case"

class TabsControllerTest < ApplicationSystemTestCase
  test "keyboard navigates horizontal tab button focus in the tablist" do
    visit examples_path

    click_on "Skip to #tabs-horizontal"
    send_keys(:tab).then   { assert_tab_button "First horizontal tab", focused: true }
    send_keys(:right).then { assert_tab_button "Second horizontal tab", focused: true }
    send_keys(:right).then { assert_tab_button "Third horizontal tab", focused: true }
    send_keys(:left).then  { assert_tab_button "Second horizontal tab", focused: true }
    send_keys(:left).then  { assert_tab_button "First horizontal tab", focused: true }
    send_keys(:end).then   { assert_tab_button "Third horizontal tab", focused: true }
    send_keys(:home).then  { assert_tab_button "First horizontal tab", focused: true }

    append <<~ERB, into: "tabs-horizontal-tablist"
      <%= aria.tabs.tab_target.tag.button type: "button" do %>
        Fourth horizontal tab
      <% end %>
    ERB

    send_keys(:end).then   { assert_tab_button "Fourth horizontal tab", focused: true }
  end

  test "keyboard navigates horizontal tab panels" do
    visit examples_path

    click_on "Skip to #tabs-horizontal"
    send_keys(:tab).then   { assert_tab_panel "First horizontal tab", open: true }
    send_keys(:right).then { assert_tab_panel "Second horizontal tab", open: true }
    send_keys(:right).then { assert_tab_panel "Third horizontal tab", open: true }
    send_keys(:left).then  { assert_tab_panel "Second horizontal tab", open: true }
    send_keys(:left).then  { assert_tab_panel "First horizontal tab", open: true }
    send_keys(:left).then  { assert_tab_panel "Third horizontal tab", open: true }
    send_keys(:right).then { assert_tab_panel "First horizontal tab", open: true }
    send_keys(:end).then   { assert_tab_panel "Third horizontal tab", open: true }
    send_keys(:home).then  { assert_tab_panel "First horizontal tab", open: true }

    append <<~ERB, into: "tabs-horizontal-tablist"
      <%= aria.tabs.tab_target.tag.button type: "button", aria: { controls: "tabs-fourth-panel" } do %>
        Fourth horizontal tab
      <% end %>
    ERB
    append <<~ERB, into: "tabs-horizontal"
      <%= aria.tabs.tabpanel_target.tag.div id: "tabs-fourth-panel" do %>
        Fourth panel
      <% end %>
    ERB

    send_keys(:end).then   { assert_tab_panel "Fourth horizontal tab", open: true }
  end

  test "keyboard navigates vertical tab panels" do
    visit examples_path

    click_on "Skip to #tabs-vertical"
    send_keys(:tab).then   { assert_tab_panel "First vertical tab", open: true }
    send_keys(:down).then  { assert_tab_panel "Second vertical tab", open: true }
    send_keys(:down).then  { assert_tab_panel "Third vertical tab", open: true }
    send_keys(:up).then    { assert_tab_panel "Second vertical tab", open: true }
    send_keys(:up).then    { assert_tab_panel "First vertical tab", open: true }
    send_keys(:up).then    { assert_tab_panel "Third vertical tab", open: true }
    send_keys(:down).then  { assert_tab_panel "First vertical tab", open: true }
    send_keys(:end).then   { assert_tab_panel "Third vertical tab", open: true }
    send_keys(:home).then  { assert_tab_panel "First vertical tab", open: true }

    append <<~ERB, into: "tabs-vertical-tablist"
      <%= aria.tabs.tab_target.tag.button type: "button", aria: { controls: "tabs-fourth-panel" } do %>
        Fourth vertical tab
      <% end %>
    ERB
    append <<~ERB, into: "tabs-vertical"
      <%= aria.tabs.tabpanel_target.tag.div id: "tabs-fourth-panel" do %>
        Fourth panel
      <% end %>
    ERB

    send_keys(:end).then   { assert_tab_panel "Fourth vertical tab", open: true }
  end

  test "keyboard navigates and selects automatically_navigate: false tab panels" do
    visit examples_path

    click_on "Skip to #tabs-click-to-select"
    navigate_then_select(:tab).then   { assert_tab_panel "First click-to-select tab", open: true }
    navigate_then_select(:right).then { assert_tab_panel "Second click-to-select tab", open: true }
    navigate_then_select(:right).then { assert_tab_panel "Third click-to-select tab", open: true }
    navigate_then_select(:left).then  { assert_tab_panel "Second click-to-select tab", open: true }
    navigate_then_select(:left).then  { assert_tab_panel "First click-to-select tab", open: true }
    navigate_then_select(:left).then  { assert_tab_panel "Third click-to-select tab", open: true }
    navigate_then_select(:right).then { assert_tab_panel "First click-to-select tab", open: true }
    navigate_then_select(:end).then   { assert_tab_panel "Third click-to-select tab", open: true }
    navigate_then_select(:home).then  { assert_tab_panel "First click-to-select tab", open: true }

    append <<~ERB, into: "tabs-click-to-select-tablist"
      <%= aria.tabs.tab_target.tag.button type: "button", aria: { controls: "tabs-fourth-panel" } do %>
        Fourth click-to-select tab
      <% end %>
    ERB
    append <<~ERB, into: "tabs-click-to-select"
      <%= aria.tabs.tabpanel_target.tag.div id: "tabs-fourth-panel" do %>
        Fourth panel
      <% end %>
    ERB

    navigate_then_select(:end).then   { assert_tab_panel "Fourth click-to-select tab", open: true }
  end

  test "tablist navigates tab buttons with roving tab order" do
    visit examples_path

    click_on "Skip to #tabs-horizontal"
    send_keys(:tab).then            { assert_tab_button "First horizontal tab", focused: true }
    send_keys(:right).then          { assert_tab_button "Second horizontal tab", focused: true }
    send_keys(:tab).then            { assert_tab_panel text: "Second horizontal panel", focused: true }
    send_keys([:shift, :tab]).then  { assert_tab_button "Second horizontal tab", focused: true }

    append <<~ERB, into: "tabs-horizontal-tablist"
      <%= aria.tabs.tab_target.tag.button type: "button", aria: { controls: "tabs-fourth-panel" } do %>
        Fourth horizontal tab
      <% end %>
    ERB

    send_keys(:tab).then            { assert_tab_panel text: "Second horizontal panel", focused: true }
    send_keys([:shift, :tab]).then  { assert_tab_button "Second horizontal tab", focused: true }
    send_keys(:tab).then            { assert_tab_panel text: "Second horizontal panel", focused: true }

    remove "tabs-horizontal-second-tab"

    send_keys([:shift, :tab]).then  { assert_tab_panel text: "First horizontal panel", focused: true }
  end

  def navigate_then_select(key = nil, times = (key.nil? ? 0.times : 1.times))
    times.each { send_keys key }.then { send_keys :space }
  end

  def assert_tab_button(*arguments, **options, &block)
    assert_selector(:tab_button, *arguments, **options, &block)
  end

  def assert_tab_panel(*arguments, **options, &block)
    assert_selector(:tab_panel, *arguments, **options, &block)
  end
end
