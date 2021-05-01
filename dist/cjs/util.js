"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siblingElements = exports.isHTMLDialogElementOrHTMLDetailsElement = exports.isHTMLDetailsElement = exports.isHTMLElement = exports.isHTMLDialogElement = void 0;
function isHTMLDialogElement(node) {
    return node instanceof Element && node.localName == "dialog";
}
exports.isHTMLDialogElement = isHTMLDialogElement;
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
exports.isHTMLElement = isHTMLElement;
function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
exports.isHTMLDetailsElement = isHTMLDetailsElement;
function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}
exports.isHTMLDialogElementOrHTMLDetailsElement = isHTMLDialogElementOrHTMLDetailsElement;
function siblingElements(element) {
    var _a;
    const elements = Array.from(((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.children) || []);
    return elements.filter(sibling => sibling != element).filter(canBeInert);
}
exports.siblingElements = siblingElements;
function canBeInert(element) {
    return "inert" in element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLFNBQWdCLG1CQUFtQixDQUFDLElBQVU7SUFDNUMsT0FBTyxJQUFJLFlBQVksT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFBO0FBQzlELENBQUM7QUFGRCxrREFFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxPQUFnQjtJQUM1QyxPQUFPLE9BQU8sWUFBWSxXQUFXLENBQUE7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBZ0I7SUFDbkQsT0FBTyxPQUFPLFlBQVksa0JBQWtCLENBQUE7QUFDOUMsQ0FBQztBQUZELG9EQUVDO0FBRUQsU0FBZ0IsdUNBQXVDLENBQUMsT0FBZ0I7SUFDdEUsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN0RSxDQUFDO0FBRkQsMEZBRUM7QUFFRCxTQUFnQixlQUFlLENBQUMsT0FBZ0I7O0lBQzlDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxhQUFhLDBDQUFFLFFBQVEsS0FBSSxFQUFFLENBQUMsQ0FBQTtJQUVsRSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzFFLENBQUM7QUFKRCwwQ0FJQztBQUVELFNBQVMsVUFBVSxDQUFDLE9BQWdCO0lBQ2xDLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQTtBQUMzQixDQUFDIn0=