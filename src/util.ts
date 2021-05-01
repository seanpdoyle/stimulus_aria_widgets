type InertElement = Element & { inert: boolean }

export function isHTMLDialogElement(node: Node): node is HTMLDialogElement {
  return node instanceof Element && node.localName == "dialog"
}

export function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement
}

export function isHTMLDetailsElement(element: Element): element is HTMLDetailsElement {
  return element instanceof HTMLDetailsElement
}

export function isHTMLDialogElementOrHTMLDetailsElement(element: Element): element is HTMLDialogElement | HTMLDetailsElement {
  return isHTMLDialogElement(element) || isHTMLDetailsElement(element)
}

export function siblingElements(element: Element): InertElement[] {
  const elements = Array.from(element.parentElement?.children || [])

  return elements.filter(sibling => sibling != element).filter(canBeInert)
}

function canBeInert(element: Element): element is InertElement {
  return "inert" in element
}
