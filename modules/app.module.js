"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const wdw_data_1 = require("wdw-data");
const log_1 = __importDefault(require("./log"));
const activity_controller_1 = __importDefault(require("./modules/activity/activity.controller"));
const dining_controller_1 = __importDefault(require("./modules/dining/dining.controller"));
const location_controller_1 = __importDefault(require("./modules/location/location.controller"));
const shop_controller_1 = __importDefault(require("./modules/shop/shop.controller"));
const status_controller_1 = __importDefault(require("./modules/status/status.controller"));
let ApplicationModule = class ApplicationModule {
};
ApplicationModule = __decorate([
    common_1.Module({
        controllers: [
            activity_controller_1.default,
            dining_controller_1.default,
            location_controller_1.default,
            shop_controller_1.default,
            status_controller_1.default
        ],
        providers: [{
                provide: 'Models',
                useFactory: async () => {
                    const models = await wdw_data_1.createModels({
                        database: 'wdw',
                        logging: false,
                        pool: {
                            max: 100 // TODO: only here because we are kicking off a shit ton of async inserts
                        },
                        username: 'tylercvetan',
                    }, log_1.default);
                    return models;
                },
            }]
    })
], ApplicationModule);
exports.default = ApplicationModule;
//# sourceMappingURL=app.module.js.map