"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_js_1 = require("./util.js");
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
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
exports.default = default_1;
default_1.classes = ["expanded"];
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return util_js_1.isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY2xvc3VyZV9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rpc2Nsb3N1cmVfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUErQztBQUMvQyx1Q0FBcUM7QUFFckMsZUFBcUIsU0FBUSxxQkFBVTtJQUF2Qzs7UUE0Q1UsdUJBQWtCLEdBQUcsQ0FBQyxRQUFpQixFQUFFLEVBQUU7WUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUFFLE9BQU07WUFFakMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO2FBQ3BFO2lCQUFNLElBQUksdUNBQXVDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUN4RSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7YUFDckM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUE7YUFDeEM7UUFDSCxDQUFDLENBQUE7UUFFTyx5QkFBb0IsR0FBRyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUFFLE9BQU07WUFFakMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFBO1lBQ3RCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTthQUN6RTtpQkFBTSxJQUFJLHVDQUF1QyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDeEUsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFBO2FBQ3ZDO2lCQUFN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