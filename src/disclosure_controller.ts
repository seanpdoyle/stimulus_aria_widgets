import { isExpanded, isHTMLDialogElement, setExpanded } from "./util.js"
import { Controller } from "stimulus"

export default class extends Controller {
  static classes = [ "expanded" ]

  attributesObserver!: MutationObserver
  elementStateObserver!: MutationObserver
  hasExpandedClass!: boolean
  expandedClass!: string

  initialize() {
    this.elementStateObserver = new MutationObserver(this.#pullStateFromElement)
    this.attributesObserver = new MutationObserver(() => {
      this.elementStateObserver.disconnect()

      if (this.controlsElement) {
        this.elementStateObserver.observe(this.controlsElement, { attributeFilter: [ "open" ] })
      }
    })
  }

  connect() {
    if (canExpand(this.element)) {
      this.#pushStateToElement(isExpanded(this.element))
    } else {
      this.#pullStateFromElement()
    }
    this.attributesObserver.observe(this.element, { attributeFilter: [ "aria-controls" ] })
    if (this.controlsElement) {
      this.elementStateObserver.observe(this.controlsElement, { attributeFilter: [ "open" ] })
    }
  }

  disconnect() {
    this.attributesObserver.disconnect()
    this.elementStateObserver.disconnect()
  }

  toggle() {
    if (isHTMLElement(this.element)) {
      this.element.focus()
    }
    const value = !isExpanded(this.element)
    setExpanded(this.element, value)
    this.#pushStateToElement(value)
  }

  #pushStateToElement = (expanded: boolean) => {
    if (!this.controlsElement) return

    if (this.hasExpandedClass) {
      this.controlsElement.classList.toggle(this.expandedClass, expanded)
    } else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
      this.controlsElement.open = expanded
    } else {
      this.controlsElement.hidden = !expanded
    }
  }

  #pullStateFromElement = () => {
    if (!this.controlsElement) return

    let isExpanded = false
    if (this.hasExpandedClass) {
      isExpanded = this.controlsElement.classList.contains(this.expandedClass)
    } else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
      isExpanded = this.controlsElement.open
    } else {
      isExpanded = !this.controlsElement.hidden
    }

    setExpanded(this.element, isExpanded)
  }

  get controlsElement(): HTMLElement | null {
    const id = this.element.getAttribute("aria-controls") || ""

    return document.getElementById(id)
  }
}

function canExpand(element: Element): boolean {
  return element.hasAttribute("aria-expanded")
}

function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement
}

function isHTMLDetailsElement(element: Element): element is HTMLDetailsElement {
  return element instanceof HTMLDetailsElement
}

function isHTMLDialogElementOrHTMLDetailsElement(element: Element): element is HTMLDialogElement | HTMLDetailsElement {
  return isHTMLDialogElement(element) || isHTMLDetailsElement(element)
}
