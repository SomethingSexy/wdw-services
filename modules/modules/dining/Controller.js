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
 * Controllers for everything dining releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
exports.default = ({ dining }) => {
    let DiningController = class DiningController {
        /**
         * Retrieves all dining
         */
        async getAllDining(type) {
            try {
                let list;
                if (type) { // tslint:disable-line
                    list = await dining.list({ type });
                }
                else {
                    list = await dining.list();
                }
                return list;
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Bulk update dining.  This might be a combination of add and update.
         * The data will be coming from wdw.
         *
         * @param dining
         */
        async batchUpsertDining(bulk) {
            try {
                return await dining.addUpdate(bulk);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single dining
         */
        async getDining(id) {
            let found;
            try {
                log_1.default.debug(`Searching for dining ${id}`);
                found = await dining.get(id);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Dining ${id} does not exist.`);
            }
            log_1.default.debug(`Found dining ${id}, returning.`);
            return found;
        }
    };
    __decorate([
        routing_controllers_1.Get('/dining'),
        __param(0, routing_controllers_1.QueryParam('type'))
    ], DiningController.prototype, "getAllDining", null);
    __decorate([
        routing_controllers_1.Post('/dining'),
        __param(0, routing_controllers_1.Body())
    ], DiningController.prototype, "batchUpsertDining", null);
    __decorate([
        routing_controllers_1.Get('/dining/:id'),
        __param(0, routing_controllers_1.Param('id'))
    ], DiningController.prototype, "getDining", null);
    DiningController = __decorate([
        routing_controllers_1.JsonController()
    ], DiningController);
    return DiningController;
};
//# sourceMappingURL=Controller.js.map