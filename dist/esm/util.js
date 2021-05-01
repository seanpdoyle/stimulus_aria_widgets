export function isHTMLDialogElement(node) {
    return node instanceof Element && node.localName == "dialog";
}
export function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
export function isHTMLDetailsElement(element) {
    return element instanceof HTMLDetailsElement;
}
export function isHTMLDialogElementOrHTMLDetailsElement(element) {
    return isHTMLDialogElement(element) || isHTMLDetailsElement(element);
}
export function siblingElements(element) {
    var _a;
    const elements = Array.from(((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.children) || []);
    return elements.filter(sibling => sibling != element).filter(canBeInert);
}
function canBeInert(element) {
    return "inert" in element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxJQUFVO0lBQzVDLE9BQU8sSUFBSSxZQUFZLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQTtBQUM5RCxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxPQUFnQjtJQUM1QyxPQUFPLE9BQU8sWUFBWSxXQUFXLENBQUE7QUFDdkMsQ0FBQztBQUVELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxPQUFnQjtJQUNuRCxPQUFPLE9BQU8sWUFBWSxrQkFBa0IsQ0FBQTtBQUM5QyxDQUFDO0FBRUQsTUFBTSxVQUFVLHVDQUF1QyxDQUFDLE9BQWdCO0lBQ3RFLE9BQU8sbUJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdEUsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBZ0I7O0lBQzlDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxhQUFhLDBDQUFFLFFBQVEsS0FBSSxFQUFFLENBQUMsQ0FBQTtJQUVsRSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzFFLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxPQUFnQjtJQUNsQyxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUE7QUFDM0IsQ0FBQyJ9