import { Controller } from "stimulus";
export default class extends Controller {
    static classes: string[];
    attributesObserver: MutationObserver;
    elementStateObserver: MutationObserver;
    hasExpandedClass: boolean;
    expandedClass: string;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    toggle(): void;
    private pushStateToElement;
    private pullStateFromElement;
    private set isExpanded(value);
    private get isExpanded();
    private get canExpand();
    get controlsElement(): HTMLElement | null;
}
//# sourceMappingURL=disclosure_controller.d.ts.map