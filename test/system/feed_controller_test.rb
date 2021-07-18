require "application_system_test_case"

class FeedControllerTest < ApplicationSystemTestCase
  test "articles in the feed can be navigated with the keyboard" do
    visit examples_path

    click_on "Skip to #feed"
    send_keys(:tab).then              { assert_article "First article", focused: true }
    send_keys(:page_down).then        { assert_article "Second article", focused: true }
    send_keys([:control, :end]).then  { assert_article "Third article", focused: true }
    send_keys(:page_up).then          { assert_article "Second article", focused: true }
    send_keys([:control, :home]).then { assert_article "First article", focused: true }

    append <<~HTML, into: "feed"
      <p role="article">Fourth article</p>
    HTML

    send_keys([:control, :end]).then   { assert_article "Fourth article", focused: true }
  end

  def assert_article(locator, **options)
    assert_css %{article, [role="article"]}, text: locator, **options
  end
end
