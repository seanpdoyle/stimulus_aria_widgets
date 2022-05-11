import polyfillDialog from "./polyfills/dialog.js"

export { default as ComboboxController } from "./combobox_controller.js"
export { default as DialogController } from "./dialog_controller.js"
export { default as DisclosureController } from "./disclosure_controller.js"
export { default as FeedController } from "./feed_controller.js"
export { default as TabsController } from "./tabs_controller.js"
export { default as GridController } from "./grid_controller.js"

export function installPolyfills(document: Document) {
  polyfillDialog(document)
}
