import { isHTMLDialogElement } from "./util.js";
import { Controller } from "stimulus";
export default class default_1 extends Controller {
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
default_1.classes = ["expanded"];
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY2xvc3VyZV9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rpc2Nsb3N1cmVfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUVyQyxNQUFNLENBQUMsT0FBTyxnQkFBTyxTQUFRLFVBQVU7SUFBdkM7O1FBNENVLHVCQUFrQixHQUFHLENBQUMsUUFBaUIsRUFBRSxFQUFFO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFNO1lBRWpDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTthQUNwRTtpQkFBTSxJQUFJLHVDQUF1QyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDeEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFBO2FBQ3JDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFBO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFBO1FBRU8seUJBQW9CLEdBQUcsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFNO1lBRWpDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQTtZQUN0QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7YUFDekU7aUJBQU0sSUFBSSx1Q0FBdUMsQ0FBQyxJQUFJLENBQUMsZUFB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