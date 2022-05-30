import dialogPolyfill from 'dialog-polyfill';
import { Controller } from 'stimulus';

function isHTMLDialogElement(node) {
    return node instanceof Element && node.localName == "dialog";
}
function siblingElements(element) {
    var _a;
    const elements = Array.from(((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.children) || []);
    return elements.filter(sibling => sibling != element).filter(canBeInert);
}
function canBeInert(element) {
    return "inert" in element;
}

function polyfill(node) {
    if (isHTMLDialogElement(node)) {
        dialogPolyfill.registerDialog(node);
    }
}
function polyfillDialog (document) {
    for (const element of document.querySelectorAll("dialog")) {
        polyfill(element);
    }
    new MutationObserver((records) => {
        for (const { target, addedNodes } of records) {
            polyfill(target);
            for (const node of addedNodes) {
                polyfill(node);
            }
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
}

class default_1$4 extends Controller {
    constructor() {
        super(...arguments);
        this.comboboxToggled = () => {
            if (this.isExpanded) {
                this.listboxTarget.hidden = false;
            }
            else {
                this.listboxTarget.hidden = true;
            }
        };
    }
    initialize() {
        this.comboboxTarget.setAttribute("aria-controls", this.listboxTarget.id);
        this.comboboxTarget.setAttribute("aria-owns", this.listboxTarget.id);
        this.expandedObserver = new MutationObserver(this.comboboxToggled);
    }
    connect() {
        this.expandedObserver.observe(this.comboboxTarget, { attributeFilter: ["aria-expanded"] });
    }
    disconnect() {
        this.expandedObserver.disconnect();
    }
    expand({ target }) {
        if (target instanceof HTMLInputElement) {
            this.isExpanded = target.value.length > 0;
        }
        else {
            this.isExpanded = true;
        }
    }
    collapse() {
        this.isExpanded = false;
    }
    navigate(event) {
        var _a;
        if (this.isExpanded) {
            let selectedOptionIndex = this.selectedOptionElement ? this.optionTargets.indexOf(this.selectedOptionElement) : 0;
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    selectedOptionIndex--;
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    selectedOptionIndex++;
                    break;
                case "Home":
                    event.preventDefault();
                    selectedOptionIndex = 0;
                    break;
                case "End":
                    event.preventDefault();
                    selectedOptionIndex = this.optionTargets.length - 1;
                    break;
                case "Enter":
                    event.preventDefault();
                    (_a = this.selectedOptionElement) === null || _a === void 0 ? void 0 : _a.click();
                    break;
                case "Escape":
                    event.preventDefault();
                    this.collapse();
                    break;
            }
            this.selectOption(selectedOptionIndex);
        }
    }
    selectOption(index) {
        if (index < 0) {
            index = this.optionTargets.length - 1;
        }
        else if (index > this.optionTargets.length - 1) {
            index = 0;
        }
        this.optionTargets.forEach(target => target.setAttribute("aria-selected", "false"));
        if (this.optionTargets[index]) {
            this.optionTargets[index].setAttribute("aria-selected", "true");
            this.comboboxTarget.setAttribute("aria-activedescendant", this.optionTargets[index].id);
        }
    }
    get selectedOptionElement() {
        return this.optionTargets.find(target => target.getAttribute("aria-selected") == "true");
    }
    get isExpanded() {
        return this.comboboxTarget.getAttribute("aria-expanded") == "true";
    }
    set isExpanded(value) {
        this.comboboxTarget.setAttribute("aria-expanded", value.toString());
    }
}
default_1$4.targets = ["combobox", "listbox", "option"];

class dialog_controller extends Controller {
    constructor() {
        super(...arguments);
        this.trapScroll = () => {
            document.documentElement.style.overflow = "hidden";
            this.element.addEventListener("close", this.releaseScroll, { once: true });
        };
        this.releaseScroll = () => {
            document.documentElement.style.overflow = "";
        };
        this.trapFocus = () => {
            siblingElements(this.element).forEach(element => element.inert = true);
            this.element.addEventListener("close", this.releaseFocus, { once: true });
        };
        this.releaseFocus = () => {
            siblingElements(this.element).forEach(element => element.inert = false);
            if (this.previouslyActiveElement instanceof HTMLElement) {
                this.previouslyActiveElement.isConnected && this.previouslyActiveElement.focus();
            }
        };
    }
    initialize() {
        this.observer = new MutationObserver(() => {
            if (isOpen(this.element)) {
                this.element.open = false;
                this.showModal();
            }
            else {
                this.close();
            }
        });
    }
    connect() {
        this.element.setAttribute("role", "dialog");
        this.element.setAttribute("aria-modal", "true");
        if (isOpen(this.element)) {
            this.element.open = false;
            this.showModal();
        }
        this.observeMutations();
    }
    disconnect() {
        this.observer.disconnect();
    }
    showModal() {
        if (isOpen(this.element))
            return;
        this.previouslyActiveElement = document.activeElement;
        this.withoutObservingMutations(dialogElement => dialogElement.showModal());
        this.trapFocus();
        this.trapScroll();
        focusFirstInteractiveElement(this.element);
        ensureLabel(this.element);
    }
    close() {
        if (isOpen(this.element)) {
            this.withoutObservingMutations(dialogElement => dialogElement.close());
        }
    }
    observeMutations(attributeFilter = ["open"]) {
        this.observer.observe(this.element, { attributeFilter: attributeFilter });
    }
    withoutObservingMutations(callback) {
        this.observer.disconnect();
        if (isHTMLDialogElement(this.element)) {
            callback(this.element);
        }
        this.observeMutations();
    }
}
function isOpen(element) {
    return isHTMLDialogElement(element) && element.open;
}
function ensureLabel(element) {
    if (element.hasAttribute("aria-labelledby") || element.hasAttribute("aria-label"))
        return;
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading) {
        element.addEventListener("close", removeLabel(element), { once: true });
        if (heading.id) {
            element.setAttribute("aria-labelledby", heading.id);
        }
        else {
            element.setAttribute("aria-label", heading.textContent || "");
        }
    }
}
function removeLabel(element) {
    return () => {
        element.removeAttribute("aria-labelledby");
        element.removeAttribute("aria-label");
    };
}
function focusFirstInteractiveElement(element) {
    const firstAutofocusElement = element.querySelector("[autofocus]");
    const interactiveElements = Array.from(element.querySelectorAll('*:not([disabled]):not([hidden]):not([type="hidden"])'));
    const firstInteractiveElement = interactiveElements.find(element => element.tabIndex > -1);
    if (firstAutofocusElement instanceof HTMLElement) {
        firstAutofocusElement.focus();
    }
    else if (firstInteractiveElement instanceof HTMLElement) {
        firstInteractiveElement.focus();
    }
}

class default_1$3 extends Controller {
    constructor() {
        super(...arguments);
        this.pushStateToElement = (expanded) => {
            if (!this.controlsElement)
                return;
            if (this.hasExpandedClass) {
                this.controlsElement.classList.toggle(this.expandedClass, expanded);
            }
            else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
                this.controlsElement.open = expanded;
            }
            else {
                this.controlsElement.hidden = !expanded;
            }
        };
        this.pullStateFromElement = () => {
            if (!this.controlsElement)
                return;
            let isExpanded = false;
            if (this.hasExpandedClass) {
                isExpanded = this.controlsElement.classList.contains(this.expandedClass);
            }
            else if (isHTMLDialogElementOrHTMLDetailsElement(this.controlsElement)) {
                isExpanded = this.controlsElement.open;
            }
            else {
                isExpanded = !this.controlsElement.hidden;
            }
            this.isExpanded = isExpanded;
        };
    }
    initialize() {
        this.elementStateObserver = new MutationObserver(this.pullStateFromElement);
        this.attributesObserver = new MutationObserver(() => {
            this.elementStateObserver.disconnect();
            if (this.controlsElement) {
                this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] });
            }
        });
    }
    connect() {
        if (this.canExpand) {
            this.pushStateToElement(this.isExpanded);
        }
        else {
            this.pullStateFromElement();
        }
        this.attributesObserver.observe(this.element, { attributeFilter: ["aria-controls"] });
        if (this.controlsElement) {
            this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] });
        }
    }
    disconnect() {
        this.attributesObserver.disconnect();
        this.elementStateObserver.disconnect();
    }
    toggle() {
        if (isHTMLElement(this.element)) {
            this.element.focus();
        }
        this.isExpanded = !this.isExpanded;
        this.pushStateToElement(this.isExpanded);
    }
    set isExpanded(expanded) {
        this.element.setAttribute("aria-expanded", expanded.toString());
    }
    get isExpanded() {
        return this.element.getAttribute("aria-expanded") == "true";
    }
    get canExpand() {
        return this.element.hasAttribute("aria-expanded");
    }
    get controlsElement() {
        const id = this.element.getAttribute("aria-controls") || "";
        return document.getElementById(id);
    }
}
default_1$3.classes = ["expanded"];
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}

class default_1$2 extends Controller {
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
default_1$2.targets = ["article"];
function updateSetSize(element, targets) {
    element.setAttribute("aria-setsize", targets.length.toString());
    targets.forEach((target, index) => {
        target.setAttribute("aria-posinset", (index + 1).toString());
    });
}

class default_1$1 extends Controller {
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
default_1$1.targets = ["tablist", "tab", "tabpanel"];
default_1$1.values = { deferSelection: Boolean };
function tokensInAttribute(element, attribute) {
    return (element.getAttribute(attribute) || "").split(/\s+/);
}
function isSelected(element) {
    return /true/i.test(element.getAttribute("aria-selected") || "");
}
function isTabindexed(element) {
    return element.tabIndex > -1;
}

class default_1 extends Controller {
    gridcellTargetConnected(target) {
        if (target.hasAttribute("tabindex"))
            return;
        const row = this.rowTargets.findIndex(row => row.contains(target));
        const column = this.gridcellTargets.indexOf(target);
        const tabindex = row == this.rowValue && column == this.columnValue ?
            0 :
            -1;
        target.setAttribute("tabindex", tabindex.toString());
    }
    captureFocus({ target }) {
        if (target instanceof HTMLElement) {
            const row = this.rowTargets.find(row => row.contains(target));
            if (row) {
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                this.rowValue = this.rowTargets.indexOf(row);
                this.columnValue = columnsInRow.indexOf(target);
                for (const column of this.gridcellTargets) {
                    const tabindex = column == target ?
                        0 :
                        -1;
                    column.setAttribute("tabindex", tabindex.toString());
                }
            }
        }
    }
    moveColumn({ key, ctrlKey, params: { directions, boundaries } }) {
        if (directions && key in directions) {
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            this.columnValue += directions[key];
            this.columnValue = Math.min(this.columnValue, columnsInRow.length - 1);
            this.columnValue = Math.max(0, this.columnValue);
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
        else if (boundaries && key in boundaries) {
            if (boundaries[key] < 1) {
                const row = ctrlKey ?
                    this.rowTargets[0] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const [nextColumn] = columnsInRow;
                if (nextColumn)
                    nextColumn.focus();
            }
            else {
                const row = ctrlKey ?
                    this.rowTargets[this.rowTargets.length - 1] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const nextColumn = columnsInRow[columnsInRow.length - 1];
                if (nextColumn)
                    nextColumn.focus();
            }
        }
    }
    moveRow({ key, params: { directions } }) {
        if (directions && key in directions) {
            this.rowValue += directions[key];
            this.rowValue = Math.min(this.rowValue, this.rowTargets.length - 1);
            this.rowValue = Math.max(0, this.rowValue);
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
    }
}
default_1.targets = ["gridcell", "row"];
default_1.values = { column: Number, row: Number };

function installPolyfills(document) {
    polyfillDialog(document);
}

export { default_1$4 as ComboboxController, dialog_controller as DialogController, default_1$3 as DisclosureController, default_1$2 as FeedController, default_1 as GridController, default_1$1 as TabsController, installPolyfills };
