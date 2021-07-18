import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "article" ]

  articleTargets!: HTMLElement[]

  connect() {
    this.element.setAttribute("role", "feed")
  }

  articleTargetConnected(target: HTMLElement) {
    updateSetSize(this.element, this.articleTargets)

    if (!/article/.test(target.localName)) target.setAttribute("role", "article")

    target.setAttribute("tabindex", "0")
  }

  articleTargetDisconnected() {
    updateSetSize(this.element, this.articleTargets)
  }

  navigate(event: KeyboardEvent) {
    const { ctrlKey, key, target } = event

    if (target instanceof HTMLElement) {
      const article = this.articleTargets.find(element => element.contains(target))

      if (article) {
        const index = this.articleTargets.indexOf(article)
        const firstIndex = 0
        const lastIndex = this.articleTargets.length - 1
        let nextArticle

        switch (key) {
          case "PageUp":
            nextArticle = this.articleTargets[Math.max(firstIndex, index - 1)]
            break
          case "PageDown":
            nextArticle = this.articleTargets[Math.min(lastIndex, index + 1)]
            break
          case "Home":
            if (ctrlKey) nextArticle = this.articleTargets[firstIndex]
            break
          case "End":
            if (ctrlKey) nextArticle = this.articleTargets[lastIndex]
            break
        }

        if (nextArticle) {
          event.preventDefault()
          nextArticle.focus()
        }
      }
    }
  }
}

function updateSetSize(element: Element, targets: HTMLElement[]) {
  element.setAttribute("aria-setsize", targets.length.toString())

  targets.forEach((target, index) => {
    target.setAttribute("aria-posinset", (index + 1).toString())
  })
}
