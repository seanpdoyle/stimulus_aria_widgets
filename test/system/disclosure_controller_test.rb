require "application_system_test_case"

 class DisclosureControllerTest < ApplicationSystemTestCase
   test "disclosure toggles <details>" do
     visit examples_path

     assert_disclosure_button "Open Details", expanded: false

     toggle_disclosure("Open Details").then  { assert_disclosure "Details", expanded: true }
     toggle_disclosure("Open Details").then  { assert_disclosure "Details", expanded: false }
     toggle_disclosure("Summary").then       { assert_disclosure_button "Open Details", expanded: true }
   end

   test "disclosure toggles CSS class" do
     visit examples_path

     assert_no_element id: "css-class", class: "expanded", text: "CSS class"
     assert_disclosure_button "Toggle CSS class", expanded: false

     toggle_disclosure("Toggle CSS class").then { assert_element id: "css-class", class: "expanded", text: "CSS class" }
     toggle_disclosure("Toggle CSS class").then { assert_no_element id: "css-class", class: "expanded", text: "CSS class" }
   end

   test "disclosure toggles hidden" do
     visit examples_path

     assert_text "Visible"
     assert_disclosure_button "Toggle Hidden", expanded: false

     toggle_disclosure("Toggle Hidden").then { assert_no_text "Visible" }
     toggle_disclosure("Toggle Hidden").then { assert_text "Visible" }
   end

   private

   def assert_element(*arguments, **options, &block)
     assert_selector(:element, *arguments, **options, &block)
   end

   def assert_no_element(*arguments, **options, &block)
     assert_no_selector(:element, *arguments, **options, &block)
   end

   def assert_disclosure(locator, **options)
     assert_selector :disclosure, locator, **options
   end

   def assert_disclosure_button(locator, **options)
     assert_selector :disclosure_button, locator, **options
   end
 end
