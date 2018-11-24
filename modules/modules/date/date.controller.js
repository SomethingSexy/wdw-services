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
const moment_1 = __importDefault(require("moment"));
const tempDays = [{
        date: '2019-02-28',
        id: '1',
        label: 'Wedensday, February, 28th 2019',
        parkHours: [{
                close: '12:00 AM',
                id: 'a',
                name: 'Magic Kingdom',
                open: '10:00 AM',
            }]
    }, {
        date: '2019-03-01',
        id: '2',
        label: 'Thursday, March 1nd 2019',
        parkHours: [{
                close: '12:00 AM',
                id: 'a',
                name: 'Magic Kingdom',
                open: '10:00 AM',
            }]
    }, {
        date: '2019-03-02',
        id: '3',
        label: 'Friday, March 2nd 2019',
        parkHours: [{
                close: '12:00 AM',
                id: 'a',
                name: 'Magic Kingdom',
                open: '10:00 AM',
            }]
    }, {
        date: '2019-03-03',
        id: '4',
        label: 'Saturday, March 3rd 2019',
        parkHours: [{
                close: '12:00 AM',
                id: 'a',
                name: 'Magic Kingdom',
                open: '10:00 AM',
            }]
    }];
/**
 * Controller to handle retrieving information around a date.
 */
let DateController = class DateController {
    /**
     * Returns information about the current day and additional days around
     * the current day for caching.
     */
    async get() {
        // TODO: given the current data, return +/- 10 dates.  We will want to look up to
        // see if we have information for those dates.
        return {
            data: {
                // active id in the list
                active: '2019-03-02',
                days: tempDays
            },
            links: {
                first: null,
                last: null,
                // TODO make this configurable
                next: 'http://localhost:6002/dates/next/',
                prev: 'http://localhost:6002/dates/prev/',
            }
        };
    }
    /**
     * Returns
     */
    async list(from, position) {
        // TODO move this to wdw-data
        const date = moment_1.default(from, 'YYYY-MM-DD');
        const days = [];
        if (position === 'next') {
            for (let index = 0; index < 10; index += 1) {
                const nextDate = date.add(1, 'days');
                days.push({
                    date: nextDate.format('YYYY-MM-DD'),
                    label: nextDate.format('dddd, MMMM Do YYYY')
                });
            }
        }
        else if (position === 'prev') {
            for (let index = 0; index < 10; index += 1) {
                const prevDate = date.subtract(1, 'days');
                days.push({
                    date: prevDate.format('YYYY-MM-DD'),
                    label: prevDate.format('dddd, MMMM Do YYYY')
                });
            }
        }
        else {
            throw new common_1.BadRequestException('Position must be next or previous');
        }
        return days;
    }
};
__decorate([
    common_1.Get('today')
], DateController.prototype, "get", null);
__decorate([
    common_1.Get(':from/:position'),
    __param(0, common_1.Param('from')), __param(1, common_1.Param('position'))
], DateController.prototype, "list", null);
DateController = __decorate([
    common_1.Controller('dates')
], DateController);
exports.default = DateController;
//# sourceMappingURL=date.controller.js.map