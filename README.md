# StimulusAriaWidgets

Short description and motivation.

## Why?

Stimulus ARIA Widgets sit in the middle of the spectrum between entirely
JavaScript-based components (like React, for example) and pre-packaged
server-generated components.

Stimulus controllers decorate client-side behavior onto server-generated
documents by targeting elements through `data-`-prefixed attribute annotations.

Stimulus is entirely client-side, and Rails is entirely server-side. Generating
the HTML with the appropriate annotations is both extremely particular and
entirely the responsibility of the server.

## Installation

Add the `stimulus_aria_widgets` dependency to your application's Gemfile:

```ruby
gem 'stimulus_aria_widgets', github: 'seanpdoyle/stimulus_aria_widgets', branch: 'main'
```

Additionally, depend on `attributes_and_token_lists`:

```ruby
gem 'attributes_and_token_lists', github: 'seanpdoyle/attributes_and_token_lists', branch: 'main'
```

And then execute:

```bash
$ bundle
```

### Installation through [importmap-rails][]

Once the gem is installed, add the client-side dependency mapping to your
project's `config/importmap.rb` declaration:

```ruby
# config/importmap.rb

pin "@seanpdoyle/stimulus_aria_widgets", to: "stimulus_aria_widgets.js"
```

[importmap-rails]: https://github.com/rails/importmap-rails

### Installation through `npm` or `yarn`

Once the gem is installed, add the client-side dependency to your project via
npm or Yarn:

```bash
yarn add https://github.com/seanpdoyle/stimulus_aria_widgets.git
```

### Installing Polyfills

The `DialogController` relies on functioning `<dialog>` elements and the
`[inert]` attribute. If your application needs to polyfill that element, install
the transitive dependencies:

* [wicg-inert](https://github.com/WICG/inert)
* [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill)

Once they're available, import and install the polyfills:

```javascript
import "wicg-inert"
import { installPolyfills } from "@seanpdoyle/stimulus_aria_widgets"

installPolyfills(document)
```

#### Installing Polyfills through [importmap-rails][]

Add the client-side dependency mappings to your project's `config/importmap.rb`
declaration:

```ruby
# config/importmap.rb

pin "wicg-inert", to: "https://cdn.skypack.dev/wicg-inert"
pin "dialog-polyfill", to: "https://cdn.skypack.dev/dialog-polyfill"
pin "@seanpdoyle/stimulus_aria_widgets", to: "stimulus_aria_widgets.js"
```

[importmap-rails]: https://github.com/rails/importmap-rails

#### Installing Polyfills through `npm` or `yarn`

Add the client-side dependencies to your project via npm or Yarn:

```bash
yarn add wicg-inert dialog-polyfill
```

## Usage

The [Accessible Rich Internet Applications Authoring Practices
1.1][aria-widgets] provide guidance for implementing commonly occurring web
widgets in accessible ways.

This engine aims to provide server-side helpers that generate HTML with the
appropriate attributes to correspond with a suite of client-side Controllers.

The majority of the sever-generated attributes are `[data-*]` or `[aria-*]`
prefixed, with the exception of `[role]`. By default, the elements are unstyled
and generated without [class][] attributes.

Each instance constructed by the `aria` helper is an instance of `Attributes`
containing `TokenList` instances.

Provided by the [seanpdoyle/attributes_and_token_lists][] gem,
`Attributes` and `TokenList` are `Hash`- and `Set`-like instances that can
combine merge attribute and token values, render themselves to HTML-safe
strings, or chain calls to `#tag` to construct HTML elements.

For more usage examples, read the project's [System Tests][] and [example
template][].

[aria-widgets]: https://www.w3.org/TR/wai-aria-practices/#aria_ex
[seanpdoyle/attributes_and_token_lists]: https://github.com/seanpdoyle/attributes_and_token_lists
[System Tests]: ./test/system
[example template]: ./test/dummy/app/views/examples/index.html.erb

### [Combobox](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js
import { Application, Controller } from "stimulus"
import { ComboboxController } from "@seanpdoyle/stimulus_aria_widgets"

const application = Application.start()
application.register("combobox", ComboboxController)
```

#### Helpers

`aria.combobox` renders attributes on the root element:

* `data-controller="combobox"`
* `data-action="input->combobox#expand"`

Targets:

`aria.combobox.combobox_target` default attributes:

* `role="combobox"`
* `autocomplete="off"`
* `data-combobox-target="combobox"`
* `data-action="keydown->combobox#navigate"`

`aria.combobox.listbox_target` default attributes:

* `role="listbox"`
* `data-combobox-target="listbox"`

`aria.combobox.option_target` default attributes:

* `role="option"`
* `tabindex="-1"`

```html+erb
<%= aria.combobox.tag.form data: { turbo_frame: "names" } do |builder| %>
  <label for="query">Names</label>
  <input id="query" <%= builder.combobox_target.merge aria: { expanded: params[:query].present? } %> type="search" name="query">

  <turbo-frame <%= builder.listbox_target %> id="names">
    <% if params[:query].present? %>
      <% %w[ Alan Alex Alice Barbara Bill Bob ].filter { |name| name.starts_with? params[:query] }.each_with_index do |name, id| %>
        <%= builder.option_target.tag.button name, type: "button", id: "name_#{id}", aria: { selected: id.zero? } %>
      <% end %>
    <% end %>
  </turbo-frame>
<% end %>
```

#### Actions

* `expand(InputEvent)`

* `collapse(Event)`

* `navigate(KeyboardEvent)`

### [Disclosure](https://www.w3.org/TR/wai-aria-practices/#disclosure)

Toggling a `<details>` element

```js
import { Application, Controller } from "stimulus"
import { DisclosureController } from "@seanpdoyle/stimulus_aria_widgets"

const application = Application.start()
application.register("disclosure", DisclosureController)
```

#### Helpers

Calls to `aria.disclosure.tag` render a `<button>` by default.

`aria.disclosure(expanded_class:)` default attributes on the root element:

* `data-controller="disclosure"`
* `data-action="click->disclosure#toggle"`
* `type="button"`

When `expanded_class:` is provided, renders:

* `data-disclosure-expanded-class`

```html+erb
<%= aria.disclosure.tag aria: { controls: "details" } do %>
  Open Details
<% end %>

<details id="details">
  <summary>Summary</summary>

  Details
</details>
```

Toggling the `[hidden]` attribute on an element

```html+erb
<button <%= aria.disclosure %> aria-controls="toggled-with-hidden">
  Toggle Hidden
</button>

<div id="toggled-with-hidden">Visible</div>
```

Toggling a CSS class on an element

```html+erb
<%= aria.disclosure(expanded_class: "expanded").tag(aria: { controls: "toggled-with-css-class" }) do %>
  Toggle CSS class
<% end %>

<div id="toggled-with-css-class">CSS class</div>
```

#### Actions

* `toggle(Event)`

### [Dialog](https://www.w3.org/TR/wai-aria-practices/#dialog_modal)

Combined with a [Disclosure](#Disclosure), toggle a `<dialog>` element

```js
import { Application, Controller } from "stimulus"
import { installPolyfills, DialogController, DisclosureController } from "@seanpdoyle/stimulus_aria_widgets"

installPolyfills(document)

const application = Application.start()
application.register("disclosure", DisclosureController)
application.register("dialog", DialogController)
```

#### Helpers

`aria.dialog` renders attributes on the root element:

* `role="dialog"`
* `data-controller="dialog"`
* `aria-model="true"`

Calls to `aria.dialog.tag` default to rendering `<dialog>` elements

```html+erb
<body>
  <main>
    <button <%= aria.disclosure %> aria-controls="dialog">
      Open Dialog
    </button>
  </main>

  <%= aria.dialog.tag id: "dialog" do %>
    <h1 id="dialog-title">Modal Dialog</h1>

    <form action="/comments" method="post">
      <label for="body">Comment body</label>
      <textarea id="body" name="todo[body]"></textarea>

      <button>Submit</button>
      <button formmethod="dialog">Cancel</button>
    </form>
  <% end %>
</body>
```

#### Actions

* `showModal(Event)`

* `close(Event)`

### [Feed](https://www.w3.org/TR/wai-aria-practices/#feed)

```js
import { Application, Controller } from "stimulus"
import { FeedController } from "@seanpdoyle/stimulus_aria_widgets"

const application = Application.start()
application.register("feed", FeedController)
```

#### Helpers

`aria.feed` renders attributes on the root element:

* `role="feed"`
* `data-controller="feed"`
* `data-action="keydown->feed#navigate"`

Targets:

`aria.feed.article_target` default attributes:

* `data-feed-target="article"`

```html+erb
<a href="#feed">Skip to #feed</a>

<div <%= aria.feed %> id="feed">
  <article <%= aria.feed.article_target %>>First article</article>
  <article <%= aria.feed.article_target %>>Second article</article>
  <article <%= aria.feed.article_target %>>Third article</article>
</div>
```

#### Actions

* `navigate(KeyboardEvent)`

### [Tabs](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel)

View content nested within [role="tabpanel"][] elements by navigating
a collection of [role="tab"][] elements nested within a [role="tablist"][]
element.

[role="tabpanel"]: https://www.w3.org/TR/wai-aria-1.2/#tabpanel
[role="tab"]: https://www.w3.org/TR/wai-aria-1.2/#tab
[role="tablist"]: https://www.w3.org/TR/wai-aria-1.2/#tablist

```js
import { Application, Controller } from "stimulus"
import { TabsController } from "@seanpdoyle/stimulus_aria_widgets"

const application = Application.start()
application.register("tabs", TabsController)
```

#### Helpers

`aria.tabs(defer_selection_value: Boolean)` renders attributes on the root element:

* `data-controller="tabs"`

Targets:

`aria.tabs.tablist_target` default attributes:

* `role="tablist"`
* `data-tabs-target="tablist"`
* `data-action="keydown->tabs#navigate"`

`aria.tabs.tab_target` default attributes:

* `role="tab"`
* `data-tabs-target="tab"`
* `data-action="click->tabs#select"`

`aria.tabs.tabpanel_target` default attributes:

* `role="tabpanel"`
* `data-tabs-target="tabpanel"`

When `defer_selection_value:` is provided, renders:

* `data-tabs-defer-selection-value`

```html+erb
<%= aria.tabs.tag id: "tabs" do |builder| %>
  <%= builder.tablist_target.tag id: "tabs-tablist" do %>
    <button <%= builder.tab_target %> id="tabs-first-tab" type="button"
            aria-controls="tabs-first-tabpanel">
      First tab
    </button>

    <button <%= builder.tab_target %> id="tabs-second-tab" type="button"
            aria-controls="tabs-second-tabpanel">
      Second tab
    </button>
  <% end %>

  <%= builder.tabpanel_target.tag id: "tabs-first-tabpanel" do %>
    First panel content
  <% end %>

  <%= builder.tabpanel_target.tag id: "tabs-second-tabpanel" do %>
    Second panel content
  <% end %>
<% end %>
```

#### Actions

* `navigate(KeyboardEvent)`
* `select(Event)`

### [Grid](https://www.w3.org/TR/wai-aria-practices-1.2/#grid)

A [role="grid"][] widget is a container that enables users to navigate the
information or interactive elements it contains using directional navigation
keys, such as arrow keys, <kbd>Home</kbd>, and <kbd>End</kbd>.

[role="grid"]: https://www.w3.org/TR/wai-aria-1.2/#grid

```js
import { Application, Controller } from "stimulus"
import { GridController } from "@seanpdoyle/stimulus_aria_widgets"

const application = Application.start()
application.register("grid", GridController)
```

#### Helpers

`aria.grid` renders attributes on the root element:

* `data-controller="grid"`

Calls to `aria.grid.tag` default to rendering `<table>` elements

Targets:

`aria.grid.row_target` default attributes:

* `role="row"`
* `data-grid-target="row"`
* `data-action="keydown->grid#moveRow"`
* `data-grid-directions-param="{"ArrowDown":1,"ArrowUp":-1,"PageDown":10,"PageUp":-10}"`

`aria.grid.gridcell_target` default attributes:

* `role="gridcell"`
* `data-grid-target="gridcell"`
* `data-action="focus->grid#captureFocus keydown->grid#moveColumn"`
* `data-grid-boundaries-param="{"Home":0,"End":1}"`
* `data-grid-directions-param="{"ArrowRight":1,"ArrowLeft":-1}"`

```html+erb
<%= aria.grid.tag id: "grid-table" do |builder| %>
  <thead>
    <tr>
      <th>1</th>
      <th>2</th>
      <th>3</th>
    </tr>
  </thead>

  <tbody>
    <%= builder.row_target.tag do %>
      <%= builder.gridcell_target.tag "A1" %>
      <%= builder.gridcell_target.tag "A2" %>
      <%= builder.gridcell_target.tag "A3" %>
    <% end %>

    <%= builder.row_target.tag do %>
      <%= builder.gridcell_target.tag "B1" %>
      <%= builder.gridcell_target.tag "B2" %>
      <%= builder.gridcell_target.tag "B3" %>
    <% end %>
  </tbody>
<% end %>
```

#### Actions

* `captureFocus(FocusEvent)`
* `moveRow(KeyboardEvent)`
* `moveColumn(KeyboardEvent)`

## Configuration

By default, the widget builder will be available via the `aria` helper method.

To configure the name of the helper, override the
`config.stimulus_aria_widgets.helper_method` value:

```ruby
Rails.application.config.stimulus_aria_widgets.helper_method = :stimulus_builder
```

## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
