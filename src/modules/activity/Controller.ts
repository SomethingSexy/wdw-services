import {
  BadRequestError,
  Body,
  Get,
  InternalServerError,
  JsonController,
  OnUndefined,
  Param,
  Post,
  QueryParam
} from 'routing-controllers';
import logger from '../../log';

/**
 * Controllers for everything activity releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
export default ({ activity }) => {
  @JsonController()
  class ActivityController {
    /**
     * Retrieves all activities
     */
    @Get('/activities')
    public async getAllActivities(
      @QueryParam('type') type?: string,
      @QueryParam('fetchSchedule') fetchSchedule?: string
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
          locations = await activity.list(where);
        } else {
          locations = await activity.list();
        }

        return locations;
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        return await activity.addUpdate(activities);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
    }

    @Post('/activities/waittimes/:timeStamp')
    @OnUndefined(204)
    public async batchAddWaitTimes(
      @Param('timeStamp') timeStamp: string,
      @Body() waittimes: any[]
    ) {
      try {
        await activity.addWaitTimes(
          timeStamp,
          waittimes
        );
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        found = await activity.get(id);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Activity ${id} does not exist.`);
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
        return await activity.addSchedules(id, schedules);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        found = await activity.getActivitySchedule(id, date);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(
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
        found = await activity.getWaittimes(id, [date]);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(
          `Activity ${id} does not exist or it does not support waittimes.`
        );
      }

      logger.debug(`Found activity wait times ${id}, returning.`);
      return found;
    }
  }

  return ActivityController;
};
