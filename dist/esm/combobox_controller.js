import { Controller } from "stimulus";
export default class default_1 extends Controller {
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
default_1.targets = ["combobox", "listbox", "option"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3hfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21ib2JveF9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFFckMsTUFBTSxDQUFDLE9BQU8sZ0JBQU8sU0FBUSxVQUFVO0lBQXZDOztRQXFGVSxvQkFBZSxHQUFHLEdBQUcsRUFBRTtZQUM3QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTthQUNsQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7YUFDakM7UUFDSCxDQUFDLENBQUE7SUFhSCxDQUFDO0lBaEdDLFVBQVU7UUFDUixJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN4RSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVwRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDcEUsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxlQUFlLEVBQUUsQ0FBRSxlQUFlLENBQUUsRUFBRSxDQUFDLENBQUE7SUFDOUYsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDcEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBYztRQUMzQixJQUFJLE1BQU0sWUFBWSxn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