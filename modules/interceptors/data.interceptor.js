"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
// tslint:disable-next-line:no-submodule-imports
const operators_1 = require("rxjs/operators");
const wdw_data_1 = require("wdw-data");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, call$) {
        return call$.pipe(operators_1.map(data => {
            if (data && data[wdw_data_1.response.Error]) {
                const contextResponse = context.switchToHttp().getResponse();
                contextResponse.status = 400;
                return data[wdw_data_1.response.Error];
            }
            if (data && data[wdw_data_1.response.Success]) {
                return data[wdw_data_1.response.Success];
            }
            return data;
        }));
    }
};
TransformInterceptor = __decorate([
    common_1.Injectable()
], TransformInterceptor);
exports.default = TransformInterceptor;
//# sourceMappingURL=data.interceptor.js.map