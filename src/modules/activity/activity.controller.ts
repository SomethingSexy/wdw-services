import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res
} from '@nestjs/common';
import logger from '../../log';

@Controller()
class ActivityController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}
  /**
   * Retrieves all activities
   */
  @Get('/activities')
  public async getAllActivities(
    @Query('type') type?: string,
    @Query('fetchSchedule') fetchSchedule?: string
  ): Promise<{}> {
    try {
      let locations;
      if (type || fetchSchedule) {
        const where: { type?: string; fetchSchedule?: boolean; } = {};
        if (type) {
          where.type = type;
        }
        if (fetchSchedule === 'true') {
          where.fetchSchedule = true;
        }
        locations = await this.models.activity.list(where);
      } else {
        locations = await this.models.activity.list();
      }

      return locations;
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Bulk update activities.  This might be a combination of add and update.
   * The data will be coming from wdw.
   *
   * @param activities
   */
  @Post('/activities')
  public async batchUpsertActivities(
    @Body() activities: any[]
  ): Promise<{}> {
    try {
      return await this.models.activity.addUpdate(activities);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  @Post('/activities/waittimes/:timeStamp')
  public async batchAddWaitTimes(
    @Param('timeStamp') timeStamp: string,
    @Body() waittimes: any[],
    @Res() response
  ) {
    try {
      const waitTimes = await this.models.activity.addWaitTimes(
        timeStamp,
        waittimes
      );

      if (!waitTimes) {
        response.status(HttpStatus.NO_CONTENT).send();
      } else {
        response.status(HttpStatus.OK).send();
      }
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Retrieves a single activity
   */
  @Get('/activities/:id')
  public async getActivity(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for activities ${id}`);
      found = await this.models.activity.get(id);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Activity ${id} does not exist.`);
    }

    logger.debug(`Found activity ${id}, returning.`);
    return found;
  }

  @Post('/activities/:id/schedules')
  public async addSchedules(
    @Param('id') id: string,
    @Body() schedules: any[]
  ): Promise<{}> {
    try {
      return await this.models.activity.addSchedules(id, schedules);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Retrieves a single activity's schedule by date
   */
  @Get('/activities/:id/schedules/:date')
  public async getActivitySchedule(
    @Param('id') id: string,
    @Param('date') date: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for schedules for activity ${id} on ${date}`);
      found = await this.models.activity.getActivitySchedule(id, date);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(
        `Activity ${id} does not exist or it does not support schedules.`
      );
    }

    logger.debug(`Found activity schedule ${id}, returning.`);
    return found;
  }

  /**
   * Retrieves a single activity's wait times for a date.
   */
  @Get('/activities/:id/waittimes/:date')
  public async getActivityWaitTimes(
    @Param('id') id: string,
    @Param('date') date: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for waittimes for activity ${id} on ${date}`);
      found = await this.models.activity.getWaittimes(id, [date]);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(
        `Activity ${id} does not exist or it does not support waittimes.`
      );
    }

    logger.debug(`Found activity wait times ${id}, returning.`);
    return found;
  }
}

export default ActivityController;
