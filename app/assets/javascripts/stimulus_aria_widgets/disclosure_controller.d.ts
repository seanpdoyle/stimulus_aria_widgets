import { Controller } from "stimulus";
export default class extends Controller {
    #private;
    static classes: string[];
    attributesObserver: MutationObserver;
    elementStateObserver: MutationObserver;
    hasExpandedClass: boolean;
    expandedClass: string;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    toggle(): void;
    get controlsElement(): HTMLElement | null;
}
//# sourceMappingURL=disclosure_controller.d.ts.map