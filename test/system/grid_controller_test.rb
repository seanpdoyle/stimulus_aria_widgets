require "application_system_test_case"

class GridControllerTest < ApplicationSystemTestCase
  test "only one of the focusable elements contained by the grid is included in the page tab sequence" do
    visit examples_path
    tab_until_focused(:link, "Jump to #grid-table")

    assert_table "A #grid-table example"
    send_keys(:tab).then { assert_gridcell "A1", focused: true, column: "1" }
    send_keys(:tab).then { assert_link "Jump back to #grid-table", focused: true }
    2.times { send_keys :shift, :tab }.then { assert_link "Jump to #grid-table", focused: true }
  end

  test "Right Arrow: Moves focus one cell to the right." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:right).then { assert_gridcell "A2", focused: true, column: "2" }
  end

  test "Right Arrow: If focus is in the last column of the grid, focus does not move." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    2.times { send_keys :right }.then { assert_gridcell "A3", focused: true, column: "3" }
    5.times { send_keys :right }.then { assert_gridcell "A3", focused: true, column: "3" }
    send_keys(:left).then             { assert_gridcell "A2", focused: true, column: "2" }
  end

  test "Left Arrow: Moves focus one cell to the left." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:right).then { assert_gridcell "A2", focused: true, column: "2" }
    send_keys(:left).then  { assert_gridcell "A1", focused: true, column: "1" }
  end

  test "Left Arrow: If focus is in the first column of the grid, focus does not move." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    5.times { send_keys :left }. then { assert_gridcell "A1", focused: true, column: "1" }
    send_keys(:right).then            { assert_gridcell "A2", focused: true, column: "2" }
  end

  test "Down Arrow: Moves focus one cell down." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:down).then { assert_gridcell "B1", focused: true, column: "1" }
  end

  test "Up Arrow: Moves focus one cell down." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:down).then { assert_gridcell "B1", focused: true, column: "1" }
    send_keys(:up).then   { assert_gridcell "A1", focused: true, column: "1" }
  end

  test "Home: moves focus to the first cell in the row that contains focus." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    2.times { send_keys :right }.then { assert_gridcell "A3", focused: true, column: "3" }
    send_keys(:home).then             { assert_gridcell "A1", focused: true, column: "1" }
  end

  test "End: moves focus to the last cell in the row that contains focus." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:end).then { assert_gridcell "A3", focused: true, column: "3" }
  end

  test "Control + Home: moves focus to the first cell in the first row." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:down).then             { assert_gridcell "B1", focused: true, column: "1" }
    send_keys(:down).then             { assert_gridcell "C1", focused: true, column: "1" }
    send_keys(:end).then              { assert_gridcell "C3", focused: true, column: "3" }
    send_keys([:control, :home]).then { assert_gridcell "A1", focused: true, column: "1" }
  end

  test "Control + End: moves focus to the last cell in the last row." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys([:control, :end]).then { assert_gridcell "C3", focused: true, column: "3" }
    send_keys(:home).then            { assert_gridcell "C1", focused: true, column: "1" }
  end

  test "Page Down: Moves focus down an author-determined number of rows" do
    visit examples_path
    7.times do
      append <<~ERB, into: "grid-table"
        <%= aria.grid.row_target.tag.tr do %>
          <%= aria.grid.gridcell_target.tag.td "X1" %>
          <%= aria.grid.gridcell_target.tag.td "X2" %>
          <%= aria.grid.gridcell_target.tag.td "X3" %>
        <% end %>
      ERB
    end
    1.times do
      append <<~ERB, into: "grid-table"
        <%= aria.grid.row_target.tag.tr do %>
          <%= aria.grid.gridcell_target.tag.td "D1" %>
          <%= aria.grid.gridcell_target.tag.td "D2" %>
          <%= aria.grid.gridcell_target.tag.td "D3" %>
        <% end %>
      ERB
    end
    5.times do
      append <<~ERB, into: "grid-table"
        <%= aria.grid.row_target.tag.tr do %>
          <%= aria.grid.gridcell_target.tag.td "X1" %>
          <%= aria.grid.gridcell_target.tag.td "X2" %>
          <%= aria.grid.gridcell_target.tag.td "X3" %>
        <% end %>
      ERB
    end
    tab_until_focused(:gridcell, "A1")

    send_keys(:page_down).then { assert_gridcell "D1", focused: true, column: "1" }
  end

  test "Page Down: If focus is in the last row of the grid, focus does not move." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    5.times { send_keys :page_down }.then { assert_gridcell "C1", focused: true, column: "1" }
    send_keys(:up).then                   { assert_gridcell "B1", focused: true, column: "1" }
  end

  test "Page Up: Moves focus up an author-determined number of rows" do
    visit examples_path
    10.times do
      append <<~ERB, into: "grid-table"
        <%= aria.grid.row_target.tag.tr do %>
          <%= aria.grid.gridcell_target.tag.td "X1" %>
          <%= aria.grid.gridcell_target.tag.td "X2" %>
          <%= aria.grid.gridcell_target.tag.td "X3" %>
        <% end %>
      ERB
    end
    tab_until_focused(:gridcell, "A1")

    send_keys([:control, :end]).then  { assert_gridcell "X3", focused: true, column: "3" }
    send_keys(:home).then             { assert_gridcell "X1", focused: true, column: "1" }
    send_keys(:page_up).then          { assert_gridcell "C1", focused: true, column: "1" }
  end

  test "Page Up: If focus is in the first row of the grid, focus does not move." do
    visit examples_path
    tab_until_focused(:gridcell, "A1")

    send_keys(:down).then               { assert_gridcell "B1", focused: true, column: "1" }
    5.times { send_keys :page_up }.then { assert_gridcell "A1", focused: true, column: "1" }
    send_keys(:down).then               { assert_gridcell "B1", focused: true, column: "1" }
  end

  def assert_gridcell(*arguments, **options, &block)
    assert_selector(:gridcell, *arguments, **options, &block)
  end

  def tab_until_focused(*arguments, **options, &block)
    using_wait_time false do
      send_keys(:tab) until page.has_selector?(*arguments, **options, focused: true, &block)
    end
  end
end
