export function isHTMLDialogElement(element) {
    return element.localName == "dialog";
}

export function siblingElements(element: Element) {
  const elements = Array.from(element.parentElement?.children || [])

  return elements.filter(sibling => sibling != element).filter(canBeInert)
}

function canBeInert(element: Element): element is InertElement {
  return "inert" in element
}
