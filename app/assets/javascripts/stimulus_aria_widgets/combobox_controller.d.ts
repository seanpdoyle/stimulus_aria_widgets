import { Controller } from "stimulus";
export default class extends Controller {
    static targets: string[];
    comboboxTarget: HTMLElement;
    optionTargets: HTMLElement[];
    listboxTarget: HTMLElement;
    expandedObserver: MutationObserver;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    expand({ target }: InputEvent): void;
    collapse(): void;
    navigate(event: KeyboardEvent): void;
    private selectOption;
    private comboboxToggled;
    private get selectedOptionElement();
    private get isExpanded();
    private set isExpanded(value);
}
//# sourceMappingURL=combobox_controller.d.ts.map