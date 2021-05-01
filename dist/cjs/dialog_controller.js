"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
const util_js_1 = require("./util.js");
class default_1 extends stimulus_1.Controller {
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
            util_js_1.siblingElements(this.element).forEach(element => element.inert = true);
            this.element.addEventListener("close", this.releaseFocus, { once: true });
        };
        this.releaseFocus = () => {
            util_js_1.siblingElements(this.element).forEach(element => element.inert = false);
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
        if (util_js_1.isHTMLDialogElement(this.element)) {
            callback(this.element);
        }
        this.observeMutations();
    }
}
exports.default = default_1;
function isOpen(element) {
    return util_js_1.isHTMLDialogElement(element) && element.open;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlhbG9nX2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBcUM7QUFDckMsdUNBQWdFO0FBRWhFLGVBQXFCLFNBQVEscUJBQVU7SUFBdkM7O1FBa0RVLGVBQVUsR0FBRyxHQUFHLEVBQUU7WUFDeEIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtZQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDNUUsQ0FBQyxDQUFBO1FBRU8sa0JBQWEsR0FBRyxHQUFHLEVBQUU7WUFDM0IsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUM5QyxDQUFDLENBQUE7UUFFTyxjQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ3ZCLHlCQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUE7WUFFdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQTtRQUVPLGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQzFCLHlCQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUE7WUFFdkUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLFlBQVks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