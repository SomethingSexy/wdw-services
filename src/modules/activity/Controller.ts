import {
  BadRequestError,
  Body,
  Get,
  InternalServerError,
  JsonController,
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
      @QueryParam('type') type?: string
    ): Promise<{}> {
      try {
        let locations;
        if (type) { // tslint:disable-line
          locations = await activity.list({ type });
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
