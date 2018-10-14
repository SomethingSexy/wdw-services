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
let DiningController = class DiningController {
    constructor(models) {
        this.models = models;
    }
    /**
     * Retrieves all dining
     */
    async getAllDining(type) {
        try {
            const list = type ? await this.models.dining.list({ type }) : await this.models.dining.list();
            return list;
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
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
            return await this.models.dining.addUpdate(bulk);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single dining
     */
    async getDining(id) {
        let found;
        try {
            log_1.default.debug(`Searching for dining ${id}`);
            found = await this.models.dining.get(id);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Dining ${id} does not exist.`);
        }
        log_1.default.debug(`Found dining ${id}, returning.`);
        return found;
    }
};
__decorate([
    common_1.Get('/dining'),
    __param(0, common_1.Query('type'))
], DiningController.prototype, "getAllDining", null);
__decorate([
    common_1.Post('/dining'),
    __param(0, common_1.Body())
], DiningController.prototype, "batchUpsertDining", null);
__decorate([
    common_1.Get('/dining/:id'),
    __param(0, common_1.Param('id'))
], DiningController.prototype, "getDining", null);
DiningController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], DiningController);
exports.default = DiningController;
//# sourceMappingURL=dining.controller.js.map