"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
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
exports.default = default_1;
default_1.targets = ["article"];
function updateSetSize(element, targets) {
    element.setAttribute("aria-setsize", targets.length.toString());
    targets.forEach((target, index) => {
        target.setAttribute("aria-posinset", (index + 1).toString());
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZF9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZlZWRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFxQztBQUVyQyxlQUFxQixTQUFRLHFCQUFVO0lBS3JDLE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELHNCQUFzQixDQUFDLE1BQW1CO1FBQ3hDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUVoRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFFN0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVELHlCQUF5QjtRQUN2QixhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFvQjtRQUMzQixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUE7UUFFdEMsSUFBSSxNQUFNLFlBQVksV0FBVyxFQUFFO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBRTdFLElBQUksT0FBTyxFQUFFO2dCQUNYLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNsRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUE7Z0JBQ3BCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtnQkFDaEQsSUFBSSxXQUFXLENBQUE7Z0JBRWYsUUFBUSxHQUFHLEVBQUU7b0JBQ1gsS0FBSyxRQUFRO3dCQUNYLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUNsRSxNQUFLO29CQUNQLEtBQUssVUFBVTt3QkFDYixXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDakUsTUFBSztvQkFDUCxLQUFLLE1BQU07d0JBQ1QsSUFBSSxPQUFPOzRCQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO3dCQUMxRCxNQUFLO29CQUNQLEtBQUssS0FBSzt3QkFDUixJQUFJLE9BQU87NEJBQUUsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7d0JBQ3pELE1BQUs7aUJBQ1I7Z0JBRUQsSUFBSSxXQUFXLEVBQUU7b0JBQ2YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO29CQUN0QixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7aUJBQ3BCO2FBQ0Y7U0FDRjtJQUNILENBQUM7O0FBdERILDRCQXVEQztBQXREUSxpQkFBTyxHQUFHLENBQUUsU0FBUyxDQUFFLENBQUE7QUF3RGhDLFNBQVMsYUFBYSxDQUFDLE9BQWdCLEVBQUUsT0FBc0I7SUFDN0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBRS9ELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUM5RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMifQ==