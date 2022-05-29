require "application_system_test_case"

class ComboboxControllerTest < ApplicationSystemTestCase
  test "can toggle when input is entered into the Combobox" do
    visit examples_path

    assert_combo_box "Names", expanded: false
    assert_no_list_box_option

    fill_in "Names", with: "A"

    assert_combo_box "Names", expanded: true, options: %w[ Alan Alex Alice ]

    send_keys :escape

    assert_combo_box "Names", expanded: false
    assert_no_list_box_option
  end

  test "can toggle when input is cleared from the Combobox" do
    visit examples_path

    fill_in "Names", with: "A"

    assert_combo_box "Names", expanded: true, options: %w[ Alan Alex Alice ]

    send_keys :backspace

    assert_combo_box "Names", expanded: false
    assert_no_list_box_option
  end

  test "can expand the Combobox in response to an event other than InputEvent" do
    visit examples_path

    assert_combo_box "Names", expanded: false

    click_on "Expand combobox"

    assert_combo_box "Names", expanded: true
  end

  test "wraps keyboard navigation from last to first and first to last" do
    visit examples_path

    fill_in "Names", with: "A"

    find(:field, "Names").click.then  { assert_list_box_option "Alan", selected: true }
    send_keys(:arrow_down).then       { assert_list_box_option "Alex", selected: true }
    send_keys(:arrow_down).then       { assert_list_box_option "Alice", selected: true }
    send_keys(:arrow_down).then       { assert_list_box_option "Alan", selected: true }
    send_keys(:arrow_up).then         { assert_list_box_option "Alice", selected: true }
    send_keys(:arrow_up).then         { assert_list_box_option "Alex", selected: true }
    send_keys(:home).then             { assert_list_box_option "Alan", selected: true }
    send_keys(:end).then              { assert_list_box_option "Alice", selected: true }
  end

  test "omits options from tab order" do
    visit examples_path
    tab_until_focused :field, "Names"

    send_keys("Al").then { assert_list_box_option "Alan", selected: true }
    send_keys(:tab).then { assert_link focused: true }
  end

  private

  def assert_combo_box(locator = nil, **options)
    assert_selector :combo_box, locator, **options
  end

  def assert_list_box_option(locator = nil, **options)
    assert_selector :list_box_option, locator, **options
  end

  def assert_no_list_box_option(locator = nil, **options)
    assert_no_selector :list_box_option, locator, **options
  end
end
