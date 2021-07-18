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

    append <<~ERB, into: "feed"
      <%= tag.p **aria.feed.article_target.merge!(id: "article_4") do %>
        Fourth article
      <% end %>
    ERB

    send_keys([:control, :end]).then   { assert_article "Fourth article", focused: true }
  end

  test "feed tracks the number of articles and their indices" do
    visit examples_path

    within (find("[role=feed]") { _1["aria-setsize"] == "3" }) do
      assert_article count: 3
    end

    append <<~ERB, into: "feed"
      <%= tag.p **aria.feed.article_target.merge!(id: "article_4") do %>
        Fourth article
      <% end %>
    ERB

    within (find("[role=feed]") { _1["aria-setsize"] == "4" }) do
      assert_article count: 4
    end

    remove "article_1"

    within (find("[role=feed]") { _1["aria-setsize"] == "3" }) do
      assert_article(count: 3)
      assert_article("Second article") { _1["aria-posinset"] == "1" }
      assert_article("Third article") { _1["aria-posinset"] == "2" }
      assert_article("Fourth article") { _1["aria-posinset"] == "3" }
    end
  end

  def assert_article(locator = nil, **options)
    assert_css %{article, [role="article"]}, text: locator, **options
  end
end
