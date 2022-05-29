import { Controller } from "stimulus";
export default class extends Controller {
    observer: MutationObserver;
    previouslyActiveElement?: Element | null;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    showModal(): void;
    close(): void;
    private trapScroll;
    private releaseScroll;
    private trapFocus;
    private releaseFocus;
    private observeMutations;
    private withoutObservingMutations;
}
//# sourceMappingURL=dialog_controller.d.ts.map