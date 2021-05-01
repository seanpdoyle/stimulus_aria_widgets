declare type InertElement = Element & {
    inert: boolean;
};
export declare function isHTMLDialogElement(node: Node): node is HTMLDialogElement;
export declare function isHTMLElement(element: Element): element is HTMLElement;
export declare function isHTMLDetailsElement(element: Element): element is HTMLDetailsElement;
export declare function isHTMLDialogElementOrHTMLDetailsElement(element: Element): element is HTMLDialogElement | HTMLDetailsElement;
export declare function siblingElements(element: Element): InertElement[];
export {};
//# sourceMappingURL=util.d.ts.map