"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
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
exports.default = default_1;
default_1.targets = ["combobox", "listbox", "option"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3hfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21ib2JveF9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXFDO0FBRXJDLGVBQXFCLFNBQVEscUJBQVU7SUFBdkM7O1FBcUZVLG9CQUFlLEdBQUcsR0FBRyxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO2FBQ2xDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTthQUNqQztRQUNILENBQUMsQ0FBQTtJQWFILENBQUM7SUFoR0MsVUFBVTtRQUNSLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXBFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUNwRSxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLGVBQWUsRUFBRSxDQUFFLGVBQWUsQ0FBRSxFQUFFLENBQUMsQ0FBQTtJQUM5RixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFjO1FBQzNCLElBQUksTUFBTSxZQUFZLGdCQUFnQixFQUFFO1lBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFB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