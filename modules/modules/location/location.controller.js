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
let LocationController = class LocationController {
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
                locations = await this.models.location.list(where);
            }
            else {
                locations = await this.models.location.list();
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
            return await this.models.location.addUpdate(locations);
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
            found = await this.models.location.get(id);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning.`);
        return found;
    }
    /**
     * Retrieves a single location's activities
     */
    async getLocationActivities(id) {
        let found;
        try {
            log_1.default.debug(`Searching for activities for location ${id}`);
            found = await this.models.location.get(id, ['activities']);
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
    async addSchedules(id, schedules) {
        try {
            return await this.models.location.addSchedules(id, schedules);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single location's schedule by date
     */
    async getLocationSchedule(id, date) {
        let found;
        try {
            log_1.default.debug(`Searching for schedules for location ${id} on ${date}`);
            found = await this.models.location.getLocationSchedule(id, date);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning.`);
        return found;
    }
};
__decorate([
    common_1.Get('/locations'),
    __param(0, common_1.Query('type')),
    __param(1, common_1.Query('fetchSchedule'))
], LocationController.prototype, "getAllLocations", null);
__decorate([
    common_1.Post('/locations'),
    __param(0, common_1.Body())
], LocationController.prototype, "batchUpsertLocations", null);
__decorate([
    common_1.Get('/locations/:id'),
    __param(0, common_1.Param('id'))
], LocationController.prototype, "getLocation", null);
__decorate([
    common_1.Get('/locations/:id/activities'),
    __param(0, common_1.Param('id'))
], LocationController.prototype, "getLocationActivities", null);
__decorate([
    common_1.Post('/locations/:id/schedules'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body())
], LocationController.prototype, "addSchedules", null);
__decorate([
    common_1.Get('/locations/:id/schedules/:date'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('date'))
], LocationController.prototype, "getLocationSchedule", null);
LocationController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], LocationController);
exports.default = LocationController;
//# sourceMappingURL=location.controller.js.map