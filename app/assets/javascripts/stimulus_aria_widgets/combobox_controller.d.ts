import { Controller } from "stimulus";
export default class extends Controller {
    #private;
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
}
//# sourceMappingURL=combobox_controller.d.ts.map