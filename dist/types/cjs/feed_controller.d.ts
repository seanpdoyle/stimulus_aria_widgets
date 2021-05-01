import { Controller } from "stimulus";
export default class extends Controller {
    observer: MutationObserver;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    navigate(event: KeyboardEvent): void;
    private refreshArticles;
    private get articleElements();
}
//# sourceMappingURL=feed_controller.d.ts.map