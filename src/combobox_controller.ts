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

    this.expandedObserver = new MutationObserver(this.comboboxToggled)
  }

  connect() {
    this.expandedObserver.observe(this.comboboxTarget, { attributeFilter: [ "aria-expanded" ] })
  }

  disconnect() {
    this.expandedObserver.disconnect()
  }

  expand({ target }: InputEvent) {
    if (target instanceof HTMLInputElement) {
      this.isExpanded = target.value.length > 0
    } else {
      this.isExpanded = true
    }
  }

  collapse() {
    this.isExpanded = false
  }

  navigate(event: KeyboardEvent) {
    if (this.isExpanded) {
      let selectedOptionIndex = this.selectedOptionElement ? this.optionTargets.indexOf(this.selectedOptionElement) : 0

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
          this.selectedOptionElement?.click()
          break
        case "Escape":
            event.preventDefault()
          this.collapse()
          break
      }

      this.selectOption(selectedOptionIndex)
    }
  }

  private selectOption(index: number) {
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

  private comboboxToggled = () => {
    if (this.isExpanded) {
      this.listboxTarget.hidden = false
    } else {
      this.listboxTarget.hidden = true
    }
  }

  private get selectedOptionElement() {
    return this.optionTargets.find(target => target.getAttribute("aria-selected") == "true")
  }

  private get isExpanded() {
    return this.comboboxTarget.getAttribute("aria-expanded") == "true"
  }

  private set isExpanded(value: boolean) {
    this.comboboxTarget.setAttribute("aria-expanded", value.toString())
  }
}
