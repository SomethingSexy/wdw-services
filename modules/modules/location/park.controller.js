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
let ParkController = class ParkController {
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
                locations = await this.models.park.list(where);
            }
            else {
                locations = await this.models.park.list();
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
            return await this.models.park.addUpdate(locations);
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
            found = await this.models.park.findById(id);
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
            found = await this.models.park.get(id, ['activities']);
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
            return await this.models.park.addSchedules(id, schedules);
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
            found = await this.models.park.getSchedule(id, date);
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
    common_1.Get('/parks'),
    __param(0, common_1.Query('type')),
    __param(1, common_1.Query('fetchSchedule'))
], ParkController.prototype, "getAllLocations", null);
__decorate([
    common_1.Post('/parks'),
    __param(0, common_1.Body())
], ParkController.prototype, "batchUpsertLocations", null);
__decorate([
    common_1.Get('/parks/:id'),
    __param(0, common_1.Param('id'))
], ParkController.prototype, "getLocation", null);
__decorate([
    common_1.Get('/parks/:id/activities'),
    __param(0, common_1.Param('id'))
], ParkController.prototype, "getLocationActivities", null);
__decorate([
    common_1.Post('/parks/:id/schedules'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body())
], ParkController.prototype, "addSchedules", null);
__decorate([
    common_1.Get('/parks/:id/schedules/:date'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('date'))
], ParkController.prototype, "getLocationSchedule", null);
ParkController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], ParkController);
exports.default = ParkController;
//# sourceMappingURL=park.controller.js.map