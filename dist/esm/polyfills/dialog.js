import dialogPolyfill from "dialog-polyfill";
import { isHTMLDialogElement } from "../util.js";
function polyfill(node) {
    if (isHTMLDialogElement(node)) {
        dialogPolyfill.registerDialog(node);
    }
}
export default function (document) {
    for (const element of document.querySelectorAll("dialog")) {
        polyfill(element);
    }
    new MutationObserver((records) => {
        for (const { target, addedNodes } of records) {
            polyfill(target);
            for (const node of addedNodes) {
                polyfill(node);
            }
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BvbHlmaWxscy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxjQUFjLE1BQU0saUJBQWlCLENBQUE7QUFDNUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sWUFBWSxDQUFBO0FBRWhELFNBQVMsUUFBUSxDQUFDLElBQVU7SUFDMUIsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QixjQUFjLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3BDO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLFdBQVUsUUFBa0I7SUFDeEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDekQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ2xCO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLE9BQXlCLEVBQUUsRUFBRTtRQUNqRCxLQUFLLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQzVDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVoQixLQUFLLE1BQU0sSUFBSSxJQUFJLFVBQVUsRUFBRTtnQkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2Y7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUMxRSxDQUFDIn0=