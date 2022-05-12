import { Controller } from "stimulus";
export default class extends Controller {
    static targets: string[];
    static values: {
        deferSelection: BooleanConstructor;
    };
    deferSelectionValue: boolean;
    readonly tabTargets: HTMLElement[];
    readonly tablistTargets: HTMLElement[];
    readonly tabpanelTargets: HTMLElement[];
    tabTargetConnected(): void;
    tabTargetDisconnected(target: HTMLElement): void;
    tabpanelTargetConnected(target: HTMLElement): void;
    tabpanelTargetDisconnected(target: HTMLElement): void;
    isolateFocus({ target }: FocusEvent): void;
    select({ target }: Event): void;
    navigate(event: KeyboardEvent): void;
    private attachTabs;
    private disconnectTabpanelControlledBy;
    private disconnectTabInControlOfTabpanel;
    private activate;
    private isolateTabindex;
}
//# sourceMappingURL=tabs_controller.d.ts.map