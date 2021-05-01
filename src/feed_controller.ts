import { Controller } from "stimulus"

export default class extends Controller {
  observer!: MutationObserver

  initialize() {
    this.observer = new MutationObserver(this.refreshArticles)
  }

  connect() {
    this.element.setAttribute("role", "feed")
    this.refreshArticles()
    this.observer.observe(this.element, { childList: true })
  }

  disconnect() {
    this.observer.disconnect()
  }

  navigate(event: KeyboardEvent) {
    const { ctrlKey, key, target } = event

    if (target instanceof Element) {
      const article = this.articleElements.find(element => element.contains(target))

      if (article) {
        const index = this.articleElements.indexOf(article)
        const firstIndex = 0
        const lastIndex = this.articleElements.length - 1
        let nextArticle

        switch (key) {
          case "PageUp":
            nextArticle = this.articleElements[Math.max(firstIndex, index - 1)]
            break
          case "PageDown":
            nextArticle = this.articleElements[Math.min(lastIndex, index + 1)]
            break
          case "Home":
            if (ctrlKey) nextArticle = this.articleElements[firstIndex]
            break
          case "End":
            if (ctrlKey) nextArticle = this.articleElements[lastIndex]
            break
        }

        if (nextArticle) {
          event.preventDefault()
          nextArticle.focus()
        }
      }
    }
  }

  private refreshArticles = () => {
    const size = this.articleElements.length + 1
    this.element.setAttribute("aria-setsize", size.toString())

    this.articleElements.forEach((element, index) => {
      element.setAttribute("tabindex", "0")
      element.setAttribute("aria-posinset", (index + 1).toString())
    })
  }

  private get articleElements(): HTMLElement[] {
    return Array.from(this.element.querySelectorAll<HTMLElement>("* > article, * > [role=article]"))
  }
}
