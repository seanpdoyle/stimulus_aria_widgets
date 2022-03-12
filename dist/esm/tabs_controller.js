import { Controller } from "stimulus";
export default class default_1 extends Controller {
    tabTargetConnected() {
        this.attachTabs();
    }
    tabTargetDisconnected(target) {
        this.disconnectTabpanelControlledBy(target);
        this.attachTabs();
    }
    tabpanelTargetConnected(target) {
        this.attachTabs();
    }
    tabpanelTargetDisconnected(target) {
        this.disconnectTabInControlOfTabpanel(target);
        this.attachTabs();
    }
    isolateFocus({ target }) {
        if (target instanceof HTMLElement)
            this.isolateTabindex(target);
    }
    select({ target }) {
        if (target instanceof HTMLElement)
            this.activate(target);
    }
    navigate(event) {
        const { key, target } = event;
        const tab = this.tabTargets.find(tab => target instanceof Element && tab.contains(target));
        if (tab) {
            const tablist = this.tablistTargets.find(tablist => tablist.contains(tab));
            const orientation = tablist && tablist.getAttribute("aria-orientation") || "";
            const vertical = /vertical/i.test(orientation);
            const horizontal = !vertical;
            const index = this.tabTargets.indexOf(tab);
            const firstIndex = 0;
            const lastIndex = this.tabTargets.length - 1;
            let nextIndex = index;
            switch (key) {
                case "ArrowLeft":
                    if (horizontal)
                        nextIndex = index - 1;
                    break;
                case "ArrowRight":
                    if (horizontal)
                        nextIndex = index + 1;
                    break;
                case "ArrowUp":
                    if (vertical)
                        nextIndex = index - 1;
                    break;
                case "ArrowDown":
                    if (vertical)
                        nextIndex = index + 1;
                    break;
                case "Home":
                    nextIndex = firstIndex;
                    break;
                case "End":
                    nextIndex = lastIndex;
                    break;
                default:
                    return;
            }
            if (nextIndex < firstIndex)
                nextIndex = lastIndex;
            if (nextIndex > lastIndex)
                nextIndex = firstIndex;
            const nextTab = this.tabTargets[nextIndex];
            if (nextTab instanceof HTMLElement) {
                event.preventDefault();
                nextTab.focus();
                if (this.deferSelectionValue)
                    return;
                else
                    this.activate(nextTab);
            }
        }
    }
    attachTabs() {
        const [first] = this.tabTargets;
        const selected = this.tabTargets.find(isSelected) || first;
        const tabindexed = this.tabTargets.find(isTabindexed) || first;
        if (selected)
            this.activate(selected);
        if (tabindexed)
            this.isolateTabindex(tabindexed);
    }
    disconnectTabpanelControlledBy(tab) {
        const controls = tokensInAttribute(tab, "aria-controls");
        for (const tabpanel of this.tabpanelTargets) {
            if (controls.includes(tabpanel.id))
                tabpanel.remove();
        }
    }
    disconnectTabInControlOfTabpanel(tabpanel) {
        for (const tab of this.tabTargets) {
            const controls = tokensInAttribute(tabpanel, "aria-controls");
            if (controls.includes(tabpanel.id))
                tab.remove();
        }
    }
    activate(tab) {
        const controls = tokensInAttribute(tab, "aria-controls");
        for (const target of this.tabpanelTargets) {
            if (controls.includes(target.id)) {
                target.setAttribute("tabindex", "0");
                target.hidden = false;
            }
            else {
                target.setAttribute("tabindex", "-1");
                target.hidden = true;
            }
        }
        for (const target of this.tabTargets) {
            target.setAttribute("aria-selected", (target == tab).toString());
        }
    }
    isolateTabindex(tab) {
        for (const target of this.tabTargets) {
            if (target.contains(tab)) {
                target.setAttribute("tabindex", "0");
            }
            else {
                target.setAttribute("tabindex", "-1");
            }
        }
    }
}
default_1.targets = ["tablist", "tab", "tabpanel"];
default_1.values = { deferSelection: Boolean };
function tokensInAttribute(element, attribute) {
    return (element.getAttribute(attribute) || "").split(/\s+/);
}
function isSelected(element) {
    return /true/i.test(element.getAttribute("aria-selected") || "");
}
function isTabindexed(element) {
    return element.tabIndex > -1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFic19jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RhYnNfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLGdCQUFPLFNBQVEsVUFBVTtJQVNyQyxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxNQUFtQjtRQUN2QyxJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDM0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxNQUFtQjtRQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELDBCQUEwQixDQUFDLE1BQW1CO1FBQzVDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFFLE1BQU0sRUFBYztRQUNqQyxJQUFJLE1BQU0sWUFBWSxXQUFXO1lBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNqRSxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFTO1FBQ3RCLElBQUksTUFBTSxZQUFZLFdBQVc7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFFRCxRQUFRLENBQUMsS0FBb0I7UUFDM0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUE7UUFFN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLFlB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