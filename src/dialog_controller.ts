import { Controller } from "stimulus"
import { isHTMLDialogElement, siblingElements } from "./util.js"

export default class extends Controller {
  observer!: MutationObserver
  previouslyActiveElement?: Element | null

  initialize() {
    this.observer = new MutationObserver(() => {
      if (isOpen(this.element)) {
        this.element.open = false
        this.showModal()
      } else {
        this.close()
      }
    })
  }

  connect() {
    this.element.setAttribute("role", "dialog")
    this.element.setAttribute("aria-modal", "true")

    if (isOpen(this.element)) {
      this.element.open = false
      this.showModal()
    }
    this.observeMutations()
  }

  disconnect() {
    this.observer.disconnect()
  }

  showModal() {
    if (isOpen(this.element)) return

    this.previouslyActiveElement = document.activeElement

    this.withoutObservingMutations(dialogElement => dialogElement.showModal())

    this.trapFocus()
    this.trapScroll()

    focusFirstInteractiveElement(this.element)
    ensureLabel(this.element)
  }

  close() {
    if (isOpen(this.element)) {
      this.withoutObservingMutations(dialogElement => dialogElement.close())
    }
  }

  private trapScroll = () => {
    document.documentElement.style.overflow = "hidden"
    this.element.addEventListener("close", this.releaseScroll, { once: true })
  }

  private releaseScroll = () => {
    document.documentElement.style.overflow = ""
  }

  private trapFocus = () => {
    siblingElements(this.element).forEach(element => element.inert = true)

    this.element.addEventListener("close", this.releaseFocus, { once: true })
  }

  private releaseFocus = () => {
    siblingElements(this.element).forEach(element => element.inert = false)

    if (this.previouslyActiveElement instanceof HTMLElement) {
      this.previouslyActiveElement.isConnected && this.previouslyActiveElement.focus()
    }
  }

  private observeMutations(attributeFilter = [ "open" ]) {
    this.observer.observe(this.element, { attributeFilter: attributeFilter })
  }

  private withoutObservingMutations(callback: (dialog: HTMLDialogElement) => void) {
    this.observer.disconnect()

    if (isHTMLDialogElement(this.element)) {
      callback(this.element)
    }

    this.observeMutations()
  }
}

function isOpen(element: Element): element is HTMLDialogElement {
  return isHTMLDialogElement(element) && element.open
}

function ensureLabel(element: Element) {
  if (element.hasAttribute("aria-labelledby") || element.hasAttribute("aria-label")) return

  const heading = element.querySelector("h1, h2, h3, h4, h5, h6")

  if (heading) {
    element.addEventListener("close", removeLabel(element), { once: true })

    if (heading.id) {
      element.setAttribute("aria-labelledby", heading.id)
    } else {
      element.setAttribute("aria-label", heading.textContent || "")
    }
  }
}

function removeLabel(element: Element) {
  return () => {
    element.removeAttribute("aria-labelledby")
    element.removeAttribute("aria-label")
  }
}

function focusFirstInteractiveElement(element: Element) {
  const firstAutofocusElement = element.querySelector<HTMLElement>("[autofocus]")
  const interactiveElements = Array.from(element.querySelectorAll<HTMLElement>('*:not([disabled]):not([hidden]):not([type="hidden"])'))
  const firstInteractiveElement = interactiveElements.find(element => element.tabIndex > -1)

  if (firstAutofocusElement instanceof HTMLElement) {
    firstAutofocusElement.focus()
  } else if (firstInteractiveElement instanceof HTMLElement) {
    firstInteractiveElement.focus()
  }
}
