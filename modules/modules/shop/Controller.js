"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const log_1 = __importDefault(require("../../log"));
/**
 * Controllers for everything shop releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
exports.default = ({ shop }) => {
    let ShopController = class ShopController {
        /**
         * Retrieves all shops
         */
        async getAllShops(type) {
            try {
                let list;
                if (type) { // tslint:disable-line
                    list = await shop.list({ type });
                }
                else {
                    list = await shop.list();
                }
                return list;
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Bulk update shops.  This might be a combination of add and update.
         * The data will be coming from wdw.
         *
         * @param shop
         */
        async batchUpsertShops(bulk) {
            try {
                return await shop.addUpdate(bulk);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single shop
         */
        async getShops(id) {
            let found;
            try {
                log_1.default.debug(`Searching for shop ${id}`);
                found = await shop.get(id);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Shop ${id} does not exist.`);
            }
            log_1.default.debug(`Found shop ${id}, returning.`);
            return found;
        }
    };
    __decorate([
        routing_controllers_1.Get('/shops'),
        __param(0, routing_controllers_1.QueryParam('type'))
    ], ShopController.prototype, "getAllShops", null);
    __decorate([
        routing_controllers_1.Post('/shops'),
        __param(0, routing_controllers_1.Body())
    ], ShopController.prototype, "batchUpsertShops", null);
    __decorate([
        routing_controllers_1.Get('/shops/:id'),
        __param(0, routing_controllers_1.Param('id'))
    ], ShopController.prototype, "getShops", null);
    ShopController = __decorate([
        routing_controllers_1.JsonController()
    ], ShopController);
    return ShopController;
};
//# sourceMappingURL=Controller.js.map