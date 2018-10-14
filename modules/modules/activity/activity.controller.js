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
let ActivityController = class ActivityController {
    constructor(models) {
        this.models = models;
    }
    /**
     * Retrieves all activities
     */
    async getAllActivities(type, fetchSchedule) {
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
                locations = await this.models.activity.list(where);
            }
            else {
                locations = await this.models.activity.list();
            }
            return locations;
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Bulk update activities.  This might be a combination of add and update.
     * The data will be coming from wdw.
     *
     * @param activities
     */
    async batchUpsertActivities(activities) {
        try {
            return await this.models.activity.addUpdate(activities);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    async batchAddWaitTimes(timeStamp, waittimes, response) {
        try {
            const waitTimes = await this.models.activity.addWaitTimes(timeStamp, waittimes);
            if (!waitTimes) {
                response.status(common_1.HttpStatus.NO_CONTENT).send();
            }
            else {
                response.status(common_1.HttpStatus.OK).send();
            }
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single activity
     */
    async getActivity(id) {
        let found;
        try {
            log_1.default.debug(`Searching for activities ${id}`);
            found = await this.models.activity.get(id);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Activity ${id} does not exist.`);
        }
        log_1.default.debug(`Found activity ${id}, returning.`);
        return found;
    }
    async addSchedules(id, schedules) {
        try {
            return await this.models.activity.addSchedules(id, schedules);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
    }
    /**
     * Retrieves a single activity's schedule by date
     */
    async getActivitySchedule(id, date) {
        let found;
        try {
            log_1.default.debug(`Searching for schedules for activity ${id} on ${date}`);
            found = await this.models.activity.getActivitySchedule(id, date);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Activity ${id} does not exist or it does not support schedules.`);
        }
        log_1.default.debug(`Found activity schedule ${id}, returning.`);
        return found;
    }
    /**
     * Retrieves a single activity's wait times for a date.
     */
    async getActivityWaitTimes(id, date) {
        let found;
        try {
            log_1.default.debug(`Searching for waittimes for activity ${id} on ${date}`);
            found = await this.models.activity.getWaittimes(id, [date]);
        }
        catch ({ message, code }) {
            throw new common_1.InternalServerErrorException(message);
        }
        if (!found) {
            throw new common_1.BadRequestException(`Activity ${id} does not exist or it does not support waittimes.`);
        }
        log_1.default.debug(`Found activity wait times ${id}, returning.`);
        return found;
    }
};
__decorate([
    common_1.Get('/activities'),
    __param(0, common_1.Query('type')),
    __param(1, common_1.Query('fetchSchedule'))
], ActivityController.prototype, "getAllActivities", null);
__decorate([
    common_1.Post('/activities'),
    __param(0, common_1.Body())
], ActivityController.prototype, "batchUpsertActivities", null);
__decorate([
    common_1.Post('/activities/waittimes/:timeStamp'),
    __param(0, common_1.Param('timeStamp')),
    __param(1, common_1.Body()),
    __param(2, common_1.Res())
], ActivityController.prototype, "batchAddWaitTimes", null);
__decorate([
    common_1.Get('/activities/:id'),
    __param(0, common_1.Param('id'))
], ActivityController.prototype, "getActivity", null);
__decorate([
    common_1.Post('/activities/:id/schedules'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body())
], ActivityController.prototype, "addSchedules", null);
__decorate([
    common_1.Get('/activities/:id/schedules/:date'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('date'))
], ActivityController.prototype, "getActivitySchedule", null);
__decorate([
    common_1.Get('/activities/:id/waittimes/:date'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('date'))
], ActivityController.prototype, "getActivityWaitTimes", null);
ActivityController = __decorate([
    common_1.Controller(),
    __param(0, common_1.Inject('Models'))
], ActivityController);
exports.default = ActivityController;
//# sourceMappingURL=activity.controller.js.map