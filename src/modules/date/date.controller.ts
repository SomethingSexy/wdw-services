import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import moment from 'moment';

const tempDays: any[] = [{
  date: '2019-02-28',
  label: 'Wedensday, February, 28th 2019',
  parkHours: [{
    close: '12:00 AM',
    id: 'a',
    name: 'Magic Kingdom',
    open: '10:00 AM',
  }]
}, {
  date: '2019-03-01',
  label: 'Thursday, March 1nd 2019',
  parkHours: [{
    close: '12:00 AM',
    id: 'a',
    name: 'Magic Kingdom',
    open: '10:00 AM',
  }]
}, {
  date: '2019-03-02',
  label: 'Friday, March 2nd 2019',
  parkHours: [{
    close: '12:00 AM',
    id: 'a',
    name: 'Magic Kingdom',
    open: '10:00 AM',
  }]
}, {
  date: '2019-03-03',
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
@Controller('dates')
class DateController {
  /**
   * Returns information about the current day and additional days around
   * the current day for caching.
   */
  @Get('today')
  public async get(): Promise<{}> {
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
  @Get(':from/:position')
  public async list(@Param('from') from, @Param('position') position): Promise<any[]> {
    // TODO move this to wdw-data
    const date = moment(from, 'YYYY-MM-DD');
    const days: any[] = [];
    if (position === 'next') {
      for (let index = 0; index < 10; index += 1) {
        const nextDate = date.add(1, 'days');
        days.push({
          date: nextDate.format('YYYY-MM-DD'),
          label: nextDate.format('dddd, MMMM Do YYYY')
        });
      }
    } else if (position === 'prev') {
      for (let index = 0; index < 10; index += 1) {
        const prevDate = date.subtract(1, 'days');
        days.push({
          date: prevDate.format('YYYY-MM-DD'),
          label: prevDate.format('dddd, MMMM Do YYYY')
        });
      }
    } else {
      throw new BadRequestException('Position must be next or previous');
    }

    return days;
  }
}

export default DateController;
