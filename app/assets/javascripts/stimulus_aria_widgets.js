import dialogPolyfill from 'dialog-polyfill';
import { Controller } from 'stimulus';

function booleanAttribute(element, attributeName) {
    const value = element.getAttribute(attributeName);
    return value == "" || /true/i.test(value || "");
}
function setExpanded(element, value) {
    element.setAttribute("aria-expanded", value.toString());
}
function isExpanded(element) {
    return booleanAttribute(element, "aria-expanded");
}
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

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

var _selectOption, _comboboxToggled;
class default_1$4 extends Controller {
    constructor() {
        super(...arguments);
        _selectOption.set(this, (index) => {
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
        });
        _comboboxToggled.set(this, () => {
            if (isExpanded(this.comboboxTarget)) {
                this.listboxTarget.hidden = false;
            }
            else {
                this.listboxTarget.hidden = true;
            }
        });
    }
    initialize() {
        this.comboboxTarget.setAttribute("aria-controls", this.listboxTarget.id);
        this.comboboxTarget.setAttribute("aria-owns", this.listboxTarget.id);
        this.expandedObserver = new MutationObserver(__classPrivateFieldGet(this, _comboboxToggled));
    }
    connect() {
        this.expandedObserver.observe(this.comboboxTarget, { attributeFilter: ["aria-expanded"] });
    }
    disconnect() {
        this.expandedObserver.disconnect();
    }
    expand({ target }) {
        if (target instanceof HTMLInputElement) {
            setExpanded(this.comboboxTarget, target.value.length > 0);
        }
        else {
            setExpanded(this.comboboxTarget, true);
        }
    }
    collapse() {
        setExpanded(this.comboboxTarget, false);
    }
    navigate(event) {
        if (isExpanded(this.comboboxTarget)) {
            const selectedOptionElement = selectedOptionFrom(this.optionTargets);
            let selectedOptionIndex = selectedOptionElement ? this.optionTargets.indexOf(selectedOptionElement) : 0;
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
                    selectedOptionElement === null || selectedOptionElement === void 0 ? void 0 : selectedOptionElement.click();
                    break;
                case "Escape":
                    event.preventDefault();
                    this.collapse();
                    break;
            }
            __classPrivateFieldGet(this, _selectOption).call(this, selectedOptionIndex);
        }
    }
}
_selectOption = new WeakMap(), _comboboxToggled = new WeakMap();
default_1$4.targets = ["combobox", "listbox", "option"];
function selectedOptionFrom(elements) {
    return elements.find(element => booleanAttribute(element, "aria-selected"));
}

var _trapScroll, _releaseScroll, _trapFocus, _releaseFocus, _observeMutations, _withoutObservingMutations;
class dialog_controller extends Controller {
    constructor() {
        super(...arguments);
        _trapScroll.set(this, () => {
            document.documentElement.style.overflow = "hidden";
            this.element.addEventListener("close", __classPrivateFieldGet(this, _releaseScroll), { once: true });
        });
        _releaseScroll.set(this, () => {
            document.documentElement.style.overflow = "";
        });
        _trapFocus.set(this, () => {
            siblingElements(this.element).forEach(element => element.inert = true);
            this.element.addEventListener("close", __classPrivateFieldGet(this, _releaseFocus), { once: true });
        });
        _releaseFocus.set(this, () => {
            siblingElements(this.element).forEach(element => element.inert = false);
            if (this.previouslyActiveElement instanceof HTMLElement) {
                this.previouslyActiveElement.isConnected && this.previouslyActiveElement.focus();
            }
        });
        _observeMutations.set(this, (attributeFilter = ["open"]) => {
            this.observer.observe(this.element, { attributeFilter: attributeFilter });
        });
        _withoutObservingMutations.set(this, (callback) => {
            this.observer.disconnect();
            if (isHTMLDialogElement(this.element)) {
                callback(this.element);
            }
            __classPrivateFieldGet(this, _observeMutations).call(this);
        });
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
        __classPrivateFieldGet(this, _observeMutations).call(this);
    }
    disconnect() {
        this.observer.disconnect();
    }
    showModal() {
        if (isOpen(this.element))
            return;
        this.previouslyActiveElement = document.activeElement;
        __classPrivateFieldGet(this, _withoutObservingMutations).call(this, dialogElement => dialogElement.showModal());
        __classPrivateFieldGet(this, _trapFocus).call(this);
        __classPrivateFieldGet(this, _trapScroll).call(this);
        focusFirstInteractiveElement(this.element);
        ensureLabel(this.element);
    }
    close() {
        if (isOpen(this.element)) {
            __classPrivateFieldGet(this, _withoutObservingMutations).call(this, dialogElement => dialogElement.close());
        }
    }
}
_trapScroll = new WeakMap(), _releaseScroll = new WeakMap(), _trapFocus = new WeakMap(), _releaseFocus = new WeakMap(), _observeMutations = new WeakMap(), _withoutObservingMutations = new WeakMap();
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

var _pushStateToElement, _pullStateFromElement;
class default_1$3 extends Controller {
    constructor() {
        super(...arguments);
        _pushStateToElement.set(this, (expanded) => {
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
        });
        _pullStateFromElement.set(this, () => {
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
            setExpanded(this.element, isExpanded);
        });
    }
    initialize() {
        this.elementStateObserver = new MutationObserver(__classPrivateFieldGet(this, _pullStateFromElement));
        this.attributesObserver = new MutationObserver(() => {
            this.elementStateObserver.disconnect();
            if (this.controlsElement) {
                this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] });
            }
        });
    }
    connect() {
        if (canExpand(this.element)) {
            __classPrivateFieldGet(this, _pushStateToElement).call(this, isExpanded(this.element));
        }
        else {
            __classPrivateFieldGet(this, _pullStateFromElement).call(this);
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
        const value = !isExpanded(this.element);
        setExpanded(this.element, value);
        __classPrivateFieldGet(this, _pushStateToElement).call(this, value);
    }
    get controlsElement() {
        const id = this.element.getAttribute("aria-controls") || "";
        return document.getElementById(id);
    }
}
_pushStateToElement = new WeakMap(), _pullStateFromElement = new WeakMap();
default_1$3.classes = ["expanded"];
function canExpand(element) {
    return element.hasAttribute("aria-expanded");
}
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

var _attachTabs, _disconnectTabpanelControlledBy, _disconnectTabInControlOfTabpanel, _activate, _isolateTabindex;
class default_1$1 extends Controller {
    constructor() {
        super(...arguments);
        _attachTabs.set(this, () => {
            const [first] = this.tabTargets;
            const selected = this.tabTargets.find(isSelected) || first;
            const tabindexed = this.tabTargets.find(isTabindexed) || first;
            if (selected)
                __classPrivateFieldGet(this, _activate).call(this, selected);
            if (tabindexed)
                __classPrivateFieldGet(this, _isolateTabindex).call(this, tabindexed);
        });
        _disconnectTabpanelControlledBy.set(this, (tab) => {
            const controls = tokensInAttribute(tab, "aria-controls");
            for (const tabpanel of this.tabpanelTargets) {
                if (controls.includes(tabpanel.id))
                    tabpanel.remove();
            }
        });
        _disconnectTabInControlOfTabpanel.set(this, (tabpanel) => {
            for (const tab of this.tabTargets) {
                const controls = tokensInAttribute(tabpanel, "aria-controls");
                if (controls.includes(tabpanel.id))
                    tab.remove();
            }
        });
        _activate.set(this, (tab) => {
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
        });
        _isolateTabindex.set(this, (tab) => {
            for (const target of this.tabTargets) {
                if (target.contains(tab)) {
                    target.setAttribute("tabindex", "0");
                }
                else {
                    target.setAttribute("tabindex", "-1");
                }
            }
        });
    }
    tabTargetConnected() {
        __classPrivateFieldGet(this, _attachTabs).call(this);
    }
    tabTargetDisconnected(target) {
        __classPrivateFieldGet(this, _disconnectTabpanelControlledBy).call(this, target);
        __classPrivateFieldGet(this, _attachTabs).call(this);
    }
    tabpanelTargetConnected(target) {
        __classPrivateFieldGet(this, _attachTabs).call(this);
    }
    tabpanelTargetDisconnected(target) {
        __classPrivateFieldGet(this, _disconnectTabInControlOfTabpanel).call(this, target);
        __classPrivateFieldGet(this, _attachTabs).call(this);
    }
    isolateFocus({ target }) {
        if (target instanceof HTMLElement)
            __classPrivateFieldGet(this, _isolateTabindex).call(this, target);
    }
    select({ target }) {
        if (target instanceof HTMLElement)
            __classPrivateFieldGet(this, _activate).call(this, target);
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
                    __classPrivateFieldGet(this, _activate).call(this, nextTab);
            }
        }
    }
}
_attachTabs = new WeakMap(), _disconnectTabpanelControlledBy = new WeakMap(), _disconnectTabInControlOfTabpanel = new WeakMap(), _activate = new WeakMap(), _isolateTabindex = new WeakMap();
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
