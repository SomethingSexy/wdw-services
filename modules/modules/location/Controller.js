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
 * Controllers for everything location releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
exports.default = ({ location }) => {
    let LocationController = class LocationController {
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
                    locations = await location.list(where);
                }
                else {
                    locations = await location.list();
                }
                return locations;
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
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
                return await location.addUpdate(locations);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single location
         */
        async getLocation(id) {
            let found;
            try {
                log_1.default.debug(`Searching for location ${id}`);
                found = await location.get(id);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Location ${id} does not exist.`);
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
                found = await location.get(id, ['activities']);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Location ${id} does not exist.`);
            }
            log_1.default.debug(`Found location ${id}, returning activities.`);
            const activities = found.activities;
            return activities;
        }
        async addSchedules(id, schedules) {
            try {
                return await location.addSchedules(id, schedules);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a single location's schedule by date
         */
        async getLocationSchedule(id, date) {
            let found;
            try {
                log_1.default.debug(`Searching for schedules for location ${id} on ${date}`);
                found = await location.getLocationSchedule(id, date);
            }
            catch ({ message, code }) {
                throw new routing_controllers_1.InternalServerError(message);
            }
            if (!found) {
                throw new routing_controllers_1.BadRequestError(`Location ${id} does not exist.`);
            }
            log_1.default.debug(`Found location ${id}, returning.`);
            return found;
        }
    };
    __decorate([
        routing_controllers_1.Get('/locations'),
        __param(0, routing_controllers_1.QueryParam('type')),
        __param(1, routing_controllers_1.QueryParam('fetchSchedule'))
    ], LocationController.prototype, "getAllLocations", null);
    __decorate([
        routing_controllers_1.Post('/locations'),
        __param(0, routing_controllers_1.Body())
    ], LocationController.prototype, "batchUpsertLocations", null);
    __decorate([
        routing_controllers_1.Get('/locations/:id'),
        __param(0, routing_controllers_1.Param('id'))
    ], LocationController.prototype, "getLocation", null);
    __decorate([
        routing_controllers_1.Get('/locations/:id/activities'),
        __param(0, routing_controllers_1.Param('id'))
    ], LocationController.prototype, "getLocationActivities", null);
    __decorate([
        routing_controllers_1.Post('/locations/:id/schedules'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Body())
    ], LocationController.prototype, "addSchedules", null);
    __decorate([
        routing_controllers_1.Get('/locations/:id/schedules/:date'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Param('date'))
    ], LocationController.prototype, "getLocationSchedule", null);
    LocationController = __decorate([
        routing_controllers_1.JsonController()
    ], LocationController);
    return LocationController;
};
//# sourceMappingURL=Controller.js.map