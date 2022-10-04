import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "tablist", "tab", "tabpanel" ]
  static values = { deferSelection: Boolean }

  deferSelectionValue!: boolean
  readonly tabTargets!: HTMLElement[]
  readonly tablistTargets!: HTMLElement[]
  readonly tabpanelTargets!: HTMLElement[]

  tabTargetConnected() {
    this.attachTabs()
  }

  tabTargetDisconnected(target: HTMLElement) {
    this.disconnectTabpanelControlledBy(target)
    this.attachTabs()
  }

  tabpanelTargetConnected() {
    this.attachTabs()
  }

  tabpanelTargetDisconnected(target: HTMLElement) {
    this.disconnectTabInControlOfTabpanel(target)
    this.attachTabs()
  }

  isolateFocus({ target }: FocusEvent) {
    if (target instanceof HTMLElement) this.isolateTabindex(target)
  }

  select({ target }: Event) {
    if (target instanceof HTMLElement) this.activate(target)
  }

  navigate(event: KeyboardEvent) {
    const { key, target } = event

    const tab = this.tabTargets.find(tab => target instanceof Element && tab.contains(target))

    if (tab) {
      const tablist = this.tablistTargets.find(tablist => tablist.contains(tab))
      const orientation = tablist && tablist.getAttribute("aria-orientation") || ""
      const vertical = /vertical/i.test(orientation)
      const horizontal = !vertical

      const index = this.tabTargets.indexOf(tab)
      const firstIndex = 0
      const lastIndex = this.tabTargets.length - 1

      let nextIndex = index

      switch (key) {
        case "ArrowLeft":
          if (horizontal) nextIndex = index - 1
          break
        case "ArrowRight":
          if (horizontal) nextIndex = index + 1
          break
        case "ArrowUp":
          if (vertical) nextIndex = index - 1
          break
        case "ArrowDown":
          if (vertical) nextIndex = index + 1
          break
        case "Home":
          nextIndex = firstIndex
          break
        case "End":
          nextIndex = lastIndex
          break
        default:
          return
      }

      if (nextIndex < firstIndex) nextIndex = lastIndex
      if (nextIndex > lastIndex)  nextIndex = firstIndex

      const nextTab = this.tabTargets[nextIndex]

      if (nextTab instanceof HTMLElement) {
        event.preventDefault()
        nextTab.focus()

        if (this.deferSelectionValue) return
        else this.activate(nextTab)
      }
    }
  }

  private attachTabs() {
    const [ first ] = this.tabTargets
    const selected = this.tabTargets.find(isSelected) || first
    const tabindexed = this.tabTargets.find(isTabindexed) || first

    if (selected) this.activate(selected)
    if (tabindexed) this.isolateTabindex(tabindexed)
  }

  private disconnectTabpanelControlledBy(tab: HTMLElement) {
    const controls = tokensInAttribute(tab, "aria-controls")

    for (const tabpanel of this.tabpanelTargets) {
      if (controls.includes(tabpanel.id)) tabpanel.remove()
    }
  }

  private disconnectTabInControlOfTabpanel(tabpanel: HTMLElement) {
    for (const tab of this.tabTargets) {
      const controls = tokensInAttribute(tabpanel, "aria-controls")

      if (controls.includes(tabpanel.id)) tab.remove()
    }
  }

  private activate(tab: HTMLElement) {
    const controls = tokensInAttribute(tab, "aria-controls")

    for (const target of this.tabpanelTargets) {
      if (controls.includes(target.id)) {
        target.setAttribute("tabindex", "0")
        target.hidden = false
      } else {
        target.setAttribute("tabindex", "-1")
        target.hidden = true
      }
    }

    for (const target of this.tabTargets) {
      target.setAttribute("aria-selected", (target == tab).toString())
    }
  }

  private isolateTabindex(tab: HTMLElement) {
    for (const target of this.tabTargets) {
      if (target.contains(tab)) {
        target.setAttribute("tabindex", "0")
      } else {
        target.setAttribute("tabindex", "-1")
      }
    }
  }
}

function tokensInAttribute(element: Element, attribute: string) {
  return (element.getAttribute(attribute) || "").split(/\s+/)
}

function isSelected(element: Element) {
  return /true/i.test(element.getAttribute("aria-selected") || "")
}

function isTabindexed(element: HTMLElement) {
  return element.tabIndex > -1
}
