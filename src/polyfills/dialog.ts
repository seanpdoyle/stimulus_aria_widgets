import dialogPolyfill from "dialog-polyfill"
import { isHTMLDialogElement } from "../util.js"

function polyfill(node: Node) {
  if (isHTMLDialogElement(node)) {
    dialogPolyfill.registerDialog(node)
  }
}

export default function(document: Document) {
  for (const element of document.querySelectorAll("dialog")) {
    polyfill(element)
  }

  new MutationObserver((records: MutationRecord[]) => {
    for (const { target, addedNodes } of records) {
      polyfill(target)

      for (const node of addedNodes) {
        polyfill(node)
      }
    }
  }).observe(document.documentElement, { subtree: true, childList: true })
}
