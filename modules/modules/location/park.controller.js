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
const parse_boolean_pipe_1 = __importDefault(require("../../pipes/parse-boolean.pipe"));
let ParkController = class ParkController {
    constructor(models) {
        this.models = models;
    }
    /**
     * Retrieves all locations
     */
    async getAllLocations(fetchSchedule) {
        try {
            let locations;
            if (fetchSchedule) {
                const where = {};
                if (fetchSchedule) {
                    where.fetchSchedule = true;
                }
                locations = await this.models.park.list(where);
            }
            else {
                locations = await this.models.park.list();
            }
            return locations;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
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
            return await this.models.park.bulkAddUpdate(locations);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
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
            found = await this.models.park.findById(id, ['activities']);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning activities.`);
        return found.data.activities;
    }
    async addSchedules(id, schedule) {
        try {
            const found = await this.models.park.findById(id);
            log_1.default.debug(`controller ${JSON.stringify(schedule, null, 4)}`);
            return await found.bulkAddSchedules(schedule);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    /**
     * Retrieves a single location's schedule by date
     */
    async getLocationSchedule(id, date) {
        let found;
        try {
            log_1.default.debug(`Searching for schedules for location ${id} on ${date}`);
            found = await this.models.park.findById(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Location ${id} does not exist.`);
        }
        log_1.default.debug(`Found location ${id}, returning.`);
        const schedules = await found.getSchedule(date);
        return schedules;
    }
};
__decorate([
    common_1.Get('/parks'),
    __param(0, common_1.Query('fetchSchedule', new parse_boolean_pipe_1.default()))
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