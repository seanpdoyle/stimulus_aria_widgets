"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_polyfill_1 = __importDefault(require("dialog-polyfill"));
const util_js_1 = require("../util.js");
function polyfill(node) {
    if (util_js_1.isHTMLDialogElement(node)) {
        dialog_polyfill_1.default.registerDialog(node);
    }
}
function default_1(document) {
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
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BvbHlmaWxscy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzRUFBNEM7QUFDNUMsd0NBQWdEO0FBRWhELFNBQVMsUUFBUSxDQUFDLElBQVU7SUFDMUIsSUFBSSw2QkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3Qix5QkFBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNwQztBQUNILENBQUM7QUFFRCxtQkFBd0IsUUFBa0I7SUFDeEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDekQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ2xCO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLE9BQXlCLEVBQUUsRUFBRTtRQUNqRCxLQUFLLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQzVDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVoQixLQUFLLE1BQU0sSUFBSSxJQUFJLFVBQVUsRUFBRTtnQkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2Y7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUMxRSxDQUFDO0FBZEQsNEJBY0MifQ==