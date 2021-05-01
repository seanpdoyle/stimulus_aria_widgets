"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPolyfills = exports.FeedController = exports.DisclosureController = exports.DialogController = exports.ComboboxController = void 0;
const dialog_js_1 = __importDefault(require("./polyfills/dialog.js"));
var combobox_controller_js_1 = require("./combobox_controller.js");
Object.defineProperty(exports, "ComboboxController", { enumerable: true, get: function () { return __importDefault(combobox_controller_js_1).default; } });
var dialog_controller_js_1 = require("./dialog_controller.js");
Object.defineProperty(exports, "DialogController", { enumerable: true, get: function () { return __importDefault(dialog_controller_js_1).default; } });
var disclosure_controller_js_1 = require("./disclosure_controller.js");
Object.defineProperty(exports, "DisclosureController", { enumerable: true, get: function () { return __importDefault(disclosure_controller_js_1).default; } });
var feed_controller_js_1 = require("./feed_controller.js");
Object.defineProperty(exports, "FeedController", { enumerable: true, get: function () { return __importDefault(feed_controller_js_1).default; } });
function installPolyfills(document) {
    dialog_js_1.default(document);
}
exports.installPolyfills = installPolyfills;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0VBQWtEO0FBRWxELG1FQUF3RTtBQUEvRCw2SUFBQSxPQUFPLE9BQXNCO0FBQ3RDLCtEQUFvRTtBQUEzRCx5SUFBQSxPQUFPLE9BQW9CO0FBQ3BDLHVFQUE0RTtBQUFuRSxpSkFBQSxPQUFPLE9BQXdCO0FBQ3hDLDJEQUFnRTtBQUF2RCxxSUFBQSxPQUFPLE9BQWtCO0FBRWxDLFNBQWdCLGdCQUFnQixDQUFDLFFBQWtCO0lBQ2pELG1CQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDMUIsQ0FBQztBQUZELDRDQUVDIn0=