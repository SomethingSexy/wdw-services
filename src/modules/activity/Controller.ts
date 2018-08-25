import {
  BadRequestError,
  // Controller,
  Get,
  InternalServerError,
  JsonController,
  Param,
  QueryParam
} from 'routing-controllers';
import logger from '../../log';

  /**
   * Controllers for everything tenant releated.  Wrapping in anonymous function to inject
   * models and services (we could look into DI instead).
   *
   * Figure out how to break this into multiple files, if this gets too big.
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
