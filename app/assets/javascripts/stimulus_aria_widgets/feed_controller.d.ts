import { Controller } from "stimulus";
export default class extends Controller {
    static targets: string[];
    articleTargets: HTMLElement[];
    connect(): void;
    articleTargetConnected(target: HTMLElement): void;
    articleTargetDisconnected(): void;
    navigate(event: KeyboardEvent): void;
}
//# sourceMappingURL=feed_controller.d.ts.map