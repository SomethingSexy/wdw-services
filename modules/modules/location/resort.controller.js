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
let ResortController = class ResortController {
    constructor(models) {
        this.models = models;
    }
    /**
     * Retrieves all locations
     */
    async getAllLocations(type, fetchSchedule) {
        try {
            let locations;
            if (type || fetchSchedule) {
                const where = {};
                if (type) {
                    where.type = type;
                }
                if (fetchSchedule === 'true') {
                    where.fetchSchedule = true;
                }
                locations = await this.models.resort.list(where);
            }
            else {
                locations = await this.models.resort.list();
            }
            return locations;
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Bulk update locations.  This might be a combination of add and update.
     * The data will be coming from wdw.
     *
     * @param locations
     */
    async batchUpsertLocations(locations) {
        try {
            return await this.models.resort.addUpdate(locations);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single location
     */
    async getLocation(id) {
        let found;
        try {
            log_1.default.debug(`Searching for location ${id}`);
            found = await this.models.resort.findById(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning.`);
        return found.data;
    }
    /**
     * Retrieves a single location's activities
     */
    async getLocationActivities(id) {
        let found;
        try {
            log_1.default.debug(`Searching for activities for location ${id}`);
            found = await this.models.resort.get(id, ['activities']);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning activities.`);
        const activities = found.activities;
        return activities;
    }
};
__decorate([
    common_1.Get('/resorts'),
    __param(0, common_1.Query('type')),
    __param(1, common_1.Query('fetchSchedule'))
], ResortController.prototype, "getAllLocations", null);
__decorate([
    common_1.Post('/resorts'),
    __param(0, common_1.Body())
], ResortController.prototype, "batchUpsertLocations", null);
__decorate([
    common_1.Get('/resorts/:id'),
    __param(0, common_1.Param('id'))
], ResortController.prototype, "getLocation", null);
__decorate([
    common_1.Get('/resorts/:id/activities'),
    __param(0, common_1.Param('id'))
], ResortController.prototype, "getLocationActivities", null);
ResortController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], ResortController);
exports.default = ResortController;
//# sourceMappingURL=resort.controller.js.map