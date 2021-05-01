import { Controller } from "stimulus";
export default class extends Controller {
    constructor() {
        super(...arguments);
        this.refreshArticles = () => {
            const size = this.articleElements.length + 1;
            this.element.setAttribute("aria-setsize", size.toString());
            this.articleElements.forEach((element, index) => {
                element.setAttribute("tabindex", "0");
                element.setAttribute("aria-posinset", (index + 1).toString());
            });
        };
    }
    initialize() {
        this.observer = new MutationObserver(this.refreshArticles);
    }
    connect() {
        this.element.setAttribute("role", "feed");
        this.refreshArticles();
        this.observer.observe(this.element, { childList: true });
    }
    disconnect() {
        this.observer.disconnect();
    }
    navigate(event) {
        const { ctrlKey, key, target } = event;
        if (target instanceof Element) {
            const article = this.articleElements.find(element => element.contains(target));
            if (article) {
                const index = this.articleElements.indexOf(article);
                const firstIndex = 0;
                const lastIndex = this.articleElements.length - 1;
                let nextArticle;
                switch (key) {
                    case "PageUp":
                        nextArticle = this.articleElements[Math.max(firstIndex, index - 1)];
                        break;
                    case "PageDown":
                        nextArticle = this.articleElements[Math.min(lastIndex, index + 1)];
                        break;
                    case "Home":
                        if (ctrlKey)
                            nextArticle = this.articleElements[firstIndex];
                        break;
                    case "End":
                        if (ctrlKey)
                            nextArticle = this.articleElements[lastIndex];
                        break;
                }
                if (nextArticle) {
                    event.preventDefault();
                    nextArticle.focus();
                }
            }
        }
    }
    get articleElements() {
        return Array.from(this.element.querySelectorAll("* > article, * > [role=article]"));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZF9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZlZWRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxVQUFVO0lBQXZDOztRQW9EVSxvQkFBZSxHQUFHLEdBQUcsRUFBRTtZQUM3QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTFELElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM5QyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFDckMsT0FBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtJQUtILENBQUM7SUE5REMsVUFBVTtRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDNUQsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDekMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDNUIsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFvQjtRQUMzQixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUE7UUFFdEMsSUFBSSxNQUFNLFlBQVksT0FBTyxFQUFFO1lBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBRTlFLElBQUksT0FBTyxFQUFFO2dCQUNYLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNuRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0JBQ3BCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtnQkFDakQsSUFBSSxXQUFXLENBQUE7Z0JBRWYsUUFBUSxHQUFHLEVBQUU7b0JBQ1gsS0FBSyxRQUFRO3dCQUNYLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUNuRSxNQUFLO29CQUNQLEtBQUssVUFBVTt3QkFDYixXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDbEUsTUFBSztvQkFDUCxLQUFLLE1BQU07d0JBQ1QsSUFBSSxPQUFPOzRCQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFBO3dCQUMzRCxNQUFLO29CQUNQLEtBQUssS0FBSzt3QkFDUixJQUFJLE9BQU87NEJBQUUsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQzFELE1BQUs7aUJBQ1I7Z0JBRUQsSUFBSSxXQUFXLEVBQUU7b0JBQ2YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO29CQUN0QixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7aUJBQ3BCO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFZRCxJQUFZLGVBQWU7UUFDekIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQWMsaUNBQWlDLENBQUMsQ0FBQyxDQUFBO0lBQ2xHLENBQUM7Q0FDRiJ9