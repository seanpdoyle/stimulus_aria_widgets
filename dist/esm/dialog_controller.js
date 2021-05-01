import { Controller } from "stimulus";
import { isHTMLDialogElement, siblingElements } from "./util.js";
export default class extends Controller {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlhbG9nX2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRWhFLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxVQUFVO0lBQXZDOztRQWtEVSxlQUFVLEdBQUcsR0FBRyxFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7WUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzVFLENBQUMsQ0FBQTtRQUVPLGtCQUFhLEdBQUcsR0FBRyxFQUFFO1lBQzNCLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7UUFDOUMsQ0FBQyxDQUFBO1FBRU8sY0FBUyxHQUFHLEdBQUcsRUFBRTtZQUN2QixlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUE7WUFFdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQTtRQUVPLGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQzFCLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxF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