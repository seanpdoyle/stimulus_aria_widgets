import { Controller } from "stimulus";
export default class default_1 extends Controller {
    connect() {
        this.element.setAttribute("role", "feed");
    }
    articleTargetConnected(target) {
        updateSetSize(this.element, this.articleTargets);
        if (!/article/.test(target.localName))
            target.setAttribute("role", "article");
        target.setAttribute("tabindex", "0");
    }
    articleTargetDisconnected() {
        updateSetSize(this.element, this.articleTargets);
    }
    navigate(event) {
        const { ctrlKey, key, target } = event;
        if (target instanceof HTMLElement) {
            const article = this.articleTargets.find(element => element.contains(target));
            if (article) {
                const index = this.articleTargets.indexOf(article);
                const firstIndex = 0;
                const lastIndex = this.articleTargets.length - 1;
                let nextArticle;
                switch (key) {
                    case "PageUp":
                        nextArticle = this.articleTargets[Math.max(firstIndex, index - 1)];
                        break;
                    case "PageDown":
                        nextArticle = this.articleTargets[Math.min(lastIndex, index + 1)];
                        break;
                    case "Home":
                        if (ctrlKey)
                            nextArticle = this.articleTargets[firstIndex];
                        break;
                    case "End":
                        if (ctrlKey)
                            nextArticle = this.articleTargets[lastIndex];
                        break;
                }
                if (nextArticle) {
                    event.preventDefault();
                    nextArticle.focus();
                }
            }
        }
    }
}
default_1.targets = ["article"];
function updateSetSize(element, targets) {
    element.setAttribute("aria-setsize", targets.length.toString());
    targets.forEach((target, index) => {
        target.setAttribute("aria-posinset", (index + 1).toString());
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZF9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZlZWRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLGdCQUFPLFNBQVEsVUFBVTtJQUtyQyxPQUFPO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxNQUFtQjtRQUN4QyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBRTdFLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFFRCx5QkFBeUI7UUFDdkIsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFRCxRQUFRLENBQUMsS0FBb0I7UUFDM0IsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFBO1FBRXRDLElBQUksTUFBTSxZQUFZLFdBQVcsRUFBRTtZQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUU3RSxJQUFJLE9BQU8sRUFBRTtnQkFDWCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDbEQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFBO2dCQUNwQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQ2hELElBQUksV0FBVyxDQUFBO2dCQUVmLFFBQVEsR0FBRyxFQUFFO29CQUNYLEtBQUssUUFBUTt3QkFDWCxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDbEUsTUFBSztvQkFDUCxLQUFLLFVBQVU7d0JBQ2IsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7d0JBQ2pFLE1BQUs7b0JBQ1AsS0FBSyxNQUFNO3dCQUNULElBQUksT0FBTzs0QkFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTt3QkFDMUQsTUFBSztvQkFDUCxLQUFLLEtBQUs7d0JBQ1IsSUFBSSxPQUFPOzRCQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO3dCQUN6RCxNQUFLO2lCQUNSO2dCQUVELElBQUksV0FBVyxFQUFFO29CQUNmLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtvQkFDdEIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO2lCQUNwQjthQUNGO1NBQ0Y7SUFDSCxDQUFDOztBQXJETSxpQkFBTyxHQUFHLENBQUUsU0FBUyxDQUFFLENBQUE7QUF3RGhDLFNBQVMsYUFBYSxDQUFDLE9BQWdCLEVBQUUsT0FBc0I7SUFDN0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBRS9ELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUM5RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMifQ==