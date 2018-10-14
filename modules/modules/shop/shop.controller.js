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
const common_1 = require("@nestjs/common");
const log_1 = __importDefault(require("../../log"));
let ShopController = class ShopController {
    constructor(models) {
        this.models = models;
    }
    /**
     * Retrieves all shops
     */
    async getAllShops(type) {
        try {
            const list = type ? await this.models.shop.list({ type }) : await this.models.shop.list();
            return list;
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
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
            return await this.models.shop.addUpdate(bulk);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single shop
     */
    async getShops(id) {
        let found;
        try {
            log_1.default.debug(`Searching for shop ${id}`);
            found = await this.models.shop.get(id);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Shop ${id} does not exist.`);
        }
        log_1.default.debug(`Found shop ${id}, returning.`);
        return found;
    }
};
__decorate([
    common_1.Get('/shops'),
    __param(0, common_1.Query('type'))
], ShopController.prototype, "getAllShops", null);
__decorate([
    common_1.Post('/shops'),
    __param(0, common_1.Body())
], ShopController.prototype, "batchUpsertShops", null);
__decorate([
    common_1.Get('/shops/:id'),
    __param(0, common_1.Param('id'))
], ShopController.prototype, "getShops", null);
ShopController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], ShopController);
exports.default = ShopController;
//# sourceMappingURL=shop.controller.js.map