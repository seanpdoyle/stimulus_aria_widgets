"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
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
exports.default = default_1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFic19jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RhYnNfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFxQztBQUVyQyxlQUFxQixTQUFRLHFCQUFVO0lBU3JDLGtCQUFrQjtRQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELHFCQUFxQixDQUFDLE1BQW1CO1FBQ3ZDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMzQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELHVCQUF1QixDQUFDLE1BQW1CO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsMEJBQTBCLENBQUMsTUFBbUI7UUFDNUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFjO1FBQ2pDLElBQUksTUFBTSxZQUFZLFdBQVc7WUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQVM7UUFDdEIsSUFBSSxNQUFNLFlBQVksV0FBVztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFvQjtRQUMzQixNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQTtRQUU3QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sWUFBWSxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENB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