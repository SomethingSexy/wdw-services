"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const wdw_data_1 = require("wdw-data");
/**
 * Interceptor to check if we are returning symbols from our data later.  Converts
 * it into a format that is better understood by the web.
 */
let NameCorrectionInterceptor = class NameCorrectionInterceptor {
    intercept(action, content) {
        if (content && content[wdw_data_1.response.Error]) {
            action.context.status = 400;
            return content[wdw_data_1.response.Error];
        }
        if (content && content[wdw_data_1.response.Success]) {
            return content[wdw_data_1.response.Success];
        }
        return content;
    }
};
NameCorrectionInterceptor = __decorate([
    routing_controllers_1.Interceptor()
], NameCorrectionInterceptor);
exports.default = NameCorrectionInterceptor;
//# sourceMappingURL=data.js.map