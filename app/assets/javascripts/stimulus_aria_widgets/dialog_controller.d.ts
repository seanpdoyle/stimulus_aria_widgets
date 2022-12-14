import { Controller } from "stimulus";
export default class extends Controller {
    #private;
    observer: MutationObserver;
    previouslyActiveElement?: Element | null;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    showModal(): void;
    close(): void;
}
//# sourceMappingURL=dialog_controller.d.ts.map