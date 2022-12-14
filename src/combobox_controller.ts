import { booleanAttribute, isExpanded, setExpanded } from "./util"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "combobox", "listbox", "option" ]

  comboboxTarget!: HTMLElement
  optionTargets!: HTMLElement[]
  listboxTarget!: HTMLElement
  expandedObserver!: MutationObserver

  initialize() {
    this.comboboxTarget.setAttribute("aria-controls", this.listboxTarget.id)
    this.comboboxTarget.setAttribute("aria-owns", this.listboxTarget.id)

    this.expandedObserver = new MutationObserver(this.#comboboxToggled)
  }

  connect() {
    this.expandedObserver.observe(this.comboboxTarget, { attributeFilter: [ "aria-expanded" ] })
  }

  disconnect() {
    this.expandedObserver.disconnect()
  }

  expand({ target }: InputEvent) {
    if (target instanceof HTMLInputElement) {
      setExpanded(this.comboboxTarget, target.value.length > 0)
    } else {
      setExpanded(this.comboboxTarget, true)
    }
  }

  collapse() {
    setExpanded(this.comboboxTarget, false)
  }

  navigate(event: KeyboardEvent) {
    if (isExpanded(this.comboboxTarget)) {
      const selectedOptionElement = selectedOptionFrom(this.optionTargets)
      let selectedOptionIndex = selectedOptionElement ? this.optionTargets.indexOf(selectedOptionElement) : 0

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          selectedOptionIndex--
          break
        case "ArrowDown":
          event.preventDefault()
          selectedOptionIndex++
          break
        case "Home":
          event.preventDefault()
          selectedOptionIndex = 0
          break
        case "End":
          event.preventDefault()
          selectedOptionIndex = this.optionTargets.length - 1
          break
        case "Enter":
          event.preventDefault()
          selectedOptionElement?.click()
          break
        case "Escape":
            event.preventDefault()
          this.collapse()
          break
      }

      this.#selectOption(selectedOptionIndex)
    }
  }

  #selectOption = (index: number) => {
    if (index < 0) {
      index = this.optionTargets.length - 1
    } else if (index > this.optionTargets.length - 1) {
      index = 0
    }

    this.optionTargets.forEach(target => target.setAttribute("aria-selected", "false"))

    if (this.optionTargets[index]) {
      this.optionTargets[index].setAttribute("aria-selected", "true")
      this.comboboxTarget.setAttribute("aria-activedescendant", this.optionTargets[index].id)
    }
  }

  #comboboxToggled = () => {
    if (isExpanded(this.comboboxTarget)) {
      this.listboxTarget.hidden = false
    } else {
      this.listboxTarget.hidden = true
    }
  }
}

function selectedOptionFrom(elements: HTMLElement[]): HTMLElement | undefined {
  return elements.find(element => booleanAttribute(element, "aria-selected"))
}
