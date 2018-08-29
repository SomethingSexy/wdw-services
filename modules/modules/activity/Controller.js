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
 * Controllers for everything activity releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
exports.default = ({ activity }) => {
    let ActivityController = class ActivityController {
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
                    locations = await activity.list(where);
                }
                else {
                    locations = await activity.list();
                }
                return locations;
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
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
                return await activity.addUpdate(activities);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single activity
         */
        async getActivity(id) {
            let found;
            try {
                log_1.default.debug(`Searching for activities ${id}`);
                found = await activity.get(id);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Activity ${id} does not exist.`);
            }
            log_1.default.debug(`Found activity ${id}, returning.`);
            return found;
        }
        async addSchedules(id, schedules) {
            try {
                return await activity.addSchedules(id, schedules);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single activity's schedule by date
         */
        async getActivitySchedule(id, date) {
            let found;
            try {
                log_1.default.debug(`Searching for schedules for activity ${id} on ${date}`);
                found = await activity.getActivitySchedule(id, date);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Activity ${id} does not exist or it does not support schedules.`);
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
                found = await activity.getWaittimes(id, [date]);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Activity ${id} does not exist or it does not support waittimes.`);
            }
            log_1.default.debug(`Found activity wait times ${id}, returning.`);
            return found;
        }
    };
    __decorate([
        routing_controllers_1.Get('/activities'),
        __param(0, routing_controllers_1.QueryParam('type')),
        __param(1, routing_controllers_1.QueryParam('fetchSchedule'))
    ], ActivityController.prototype, "getAllActivities", null);
    __decorate([
        routing_controllers_1.Post('/activities'),
        __param(0, routing_controllers_1.Body())
    ], ActivityController.prototype, "batchUpsertActivities", null);
    __decorate([
        routing_controllers_1.Get('/activities/:id'),
        __param(0, routing_controllers_1.Param('id'))
    ], ActivityController.prototype, "getActivity", null);
    __decorate([
        routing_controllers_1.Post('/activities/:id/schedules'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Body())
    ], ActivityController.prototype, "addSchedules", null);
    __decorate([
        routing_controllers_1.Get('/activities/:id/schedules/:date'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Param('date'))
    ], ActivityController.prototype, "getActivitySchedule", null);
    __decorate([
        routing_controllers_1.Get('/activities/:id/waittimes/:date'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Param('date'))
    ], ActivityController.prototype, "getActivityWaitTimes", null);
    ActivityController = __decorate([
        routing_controllers_1.JsonController()
    ], ActivityController);
    return ActivityController;
};
//# sourceMappingURL=Controller.js.map