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

Additionally, depend on `action_view-attributes_and_token_lists`:

```ruby
gem 'action_view-attributes_and_token_lists', github: 'seanpdoyle/action_view-attributes_and_token_lists', branch: 'main'
```

And then execute:

```bash
$ bundle
```

Once the gem is installed, add the client-side dependency to your project via
npm or Yarn:

```bash
yarn add https://github.com/seanpdoyle/stimulus_aria_widgets.git
```

### Installing Polyfills

The `DialogController` relies on functioning `<dialog>` elements and the
`[inert]` attribute. If your application needs to polyfill that element, install
the transitive dependencies:

```bash
yarn add wicg-inert dialog-polyfill
```

Then import the polyfill:

```javascript
import "wicg-inert"
import { installPolyfills } from "@seanpdoyle/stimulus_aria_widgets"

installPolyfills(document)
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

Provided by the [seanpdoyle/action_view-attributes_and_token_lists][] gem,
`Attributes` and `TokenList` are `Hash`- and `Set`-like instances that can
combine merge attribute and token values, render themselves to HTML-safe
strings, or chain calls to `#tag` to construct HTML elements.

For more usage examples, read the project's [System Tests][] and [example
template][].

[aria-widgets]: https://www.w3.org/TR/wai-aria-practices/#aria_ex
[seanpdoyle/action_view-attributes_and_token_lists]: https://github.com/seanpdoyle/action_view-attributes_and_token_lists
[System Tests]: ./test/system
[example template]: ./test/dummy/app/views/examples/index.html.erb

### [Combobox](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js
import { Application, Controller } from "stimulus"
import { ComboboxController } from "stimulus_aria_widgets"

const application = Application.start()
application.register("combobox", ComboboxController)
```

#### Helpers

`aria.combobox` embeds attributes on the root element:

* `data-controller="combobox"`
* `data-action="input->combobox#expand"`

Targets:

`aria.combobox.combobox_target` embeds attributes:

* `data-combobox-target="combobox"`
* `data-action="keydown->combobox#navigate"`
* `role="combobox"`

`aria.combobox.listbox_target` embeds attributes:

* `data-combobox-target="listbox"`
* `role="listbox"`

`aria.combobox.option_target` embeds attributes:

* `role="option"`

```html+erb
<form <%= aria.combobox %> data-turbo-frame="names">
  <label for="query">Names</label>
  <input id="query" <%= aria.combobox.combobox_target.merge aria: { expanded: params[:query].present? } %> type="search" name="query">

  <turbo-frame <%= aria.combobox.listbox_target %> id="names">
    <% if params[:query].present? %>
      <% %w[ Alan Alex Alice Barbara Bill Bob ].filter { |name| name.starts_with? params[:query] }.each_with_index do |name, id| %>
        <%= aria.combobox.option.tag.button name, type: "button", id: "name_#{id}", aria: { selected: id.zero? } %>
      <% end %>
    <% end %>
  </turbo-frame>
</form>
```

#### Actions

* `expand(InputEvent)`

* `collapse(Event)`

* `navigate(KeyboardEvent)`

### [Disclosure](https://www.w3.org/TR/wai-aria-practices/#disclosure)

Toggling a `<details>` element

```js
import { Application, Controller } from "stimulus"
import { DisclosureController } from "stimulus_aria_widgets"

const application = Application.start()
application.register("disclosure", DisclosureController)
```

#### Helpers

`aria.disclosure(expanded_class:)` embeds attributes on the root element:

* `data-controller="disclosure"`
* `data-action="click->disclosure#toggle"`
* `type="button"`

When `expanded_class:` is provided, embeds:

* `data-disclosure-expanded-class`

```html+erb
<button <%= aria.disclosure %> aria-controls="details">
  Open Details
</button>

<details id="details">
  <summary>Summary</summary>

  Details
</details>
```

Toggling the `[hidden]` attribute on an element

```html+erb
<button <%= aria.disclosure %> aria-controls="hidden">
  Toggle Hidden
</button>

<div id="hidden">Visible</div>
```

Toggling a CSS class on an element

```html+erb
<button <%= aria.disclosure expanded_class: "expanded" %> aria-controls="css-class">
  Toggle CSS class
</button>

<div id="css-class">CSS class</div>
```

#### Actions

* `toggle(Event)`

### [Dialog](https://www.w3.org/TR/wai-aria-practices/#dialog_modal)

Combined with a [Disclosure](#Disclosure), toggle a `<dialog>` element

```js
import { Application, Controller } from "stimulus"
import { DialogController, DisclosureController } from "stimulus_aria_widgets"
import "stimulus_aria_widgets/polyfills"

const application = Application.start()
application.register("disclosure", DisclosureController)
application.register("dialog", DialogController)
```

#### Helpers

`aria.dialog` embeds attributes on the root element:

* `data-controller="dialog"`
* `aria-modal="true"`
* `role="dialog"`

```html+erb
<body>
  <main>
    <button <%= aria.disclosure %> aria-controls="dialog">
      Open Dialog
    </button>
  </main>

  <dialog <%= aria.dialog %> id="dialog">
    <h1 id="dialog-title">Modal Dialog</h1>

    <form action="/comments" method="post">
      <label for="body">Comment body</label>
      <textarea id="body" name="todo[body]"></textarea>

      <button>Submit</button>
      <button formmethod="dialog">Cancel</button>
    </form>
  </dialog>
</body>
```

#### Actions

* `showModal(Event)`

* `close(Event)`

### [Feed](https://www.w3.org/TR/wai-aria-practices/#feed)

```js
import { Application, Controller } from "stimulus"
import { FeedController } from "stimulus_aria_widgets"

const application = Application.start()
application.register("feed", FeedController)
```

#### Helpers

`aria.feed` embeds attributes on the root element:

* `data-controller="feed"`
* `data-action="keydown->feed#navigate"`
* `role="feed"`

```html+erb
<a href="#feed">Skip to #feed</a>

<div <%= aria.feed %> id="feed">
  <article>First article</article>
  <article>Second article</article>
  <article>Third article</article>
</div>
```

#### Actions

* `navigate(KeyboardEvent)`

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
