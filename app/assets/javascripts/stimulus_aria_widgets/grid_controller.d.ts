import { Controller } from "stimulus";
declare type GridEventWithParams<T> = T & {
    params: {
        directions?: {
            [key: string]: number;
        };
        boundaries?: {
            [key: string]: number;
        };
    };
};
export default class extends Controller {
    static targets: string[];
    static values: {
        column: NumberConstructor;
        row: NumberConstructor;
    };
    columnValue: number;
    rowValue: number;
    readonly rowTargets: HTMLElement[];
    readonly gridcellTargets: HTMLElement[];
    gridcellTargetConnected(target: HTMLElement): void;
    captureFocus({ target }: FocusEvent): void;
    moveColumn({ key, ctrlKey, params: { directions, boundaries } }: GridEventWithParams<KeyboardEvent>): void;
    moveRow({ key, params: { directions } }: GridEventWithParams<KeyboardEvent>): void;
}
export {};
//# sourceMappingURL=grid_controller.d.ts.map