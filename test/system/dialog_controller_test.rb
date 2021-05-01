require "application_system_test_case"

class DialogControllerTest < ApplicationSystemTestCase
  test "dialog is focus-trapping modal" do
    visit examples_path

    toggle_disclosure "Open Dialog", expand: true
    within_modal "Modal Dialog" do
      assert_field "First input", focused: true
      assert_field "Second input", focused: false

      send_keys([:shift, :tab]).then    { assert_no_button "Open Dialog", focused: true }
      2.times { send_keys(:tab) }.then  { assert_field "Second input", focused: true }
      send_keys(:tab).then              { assert_field "Third input", focused: true }
      send_keys(:tab).then              { assert_button "Cancel", focused: true }
      send_keys(:tab).then              { assert_button "Submit", focused: true }
      send_keys(:tab).then              { assert_no_button "Skipped in tab order", focused: true }
    end
    send_keys(:escape).then             { assert_button "Open Dialog", focused: true }
  end

  test "cancel button closes the dialog and restores focus to the expander" do
    visit examples_path

    toggle_disclosure "Open Dialog", expand: true
    within_modal "Modal Dialog" do
      click_button "Cancel"
    end

    assert_button "Open Dialog", focused: true
  end
end
