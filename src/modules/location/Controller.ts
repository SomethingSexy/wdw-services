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
   * Controllers for everything tenant releated.  Wrapping in anonymous function to inject
   * models and services (we could look into DI instead).
   *
   * Figure out how to break this into multiple files, if this gets too big.
   */
export default ({ location }) => {
  @JsonController()
  class LocationController {
    /**
     * Retrieves all locations
     */
    @Get('/locations')
    public async getAllLocations(
      @QueryParam('type') type?: string
    ): Promise<{}> {
      try {
        let locations;
        if (type) { // tslint:disable-line
          locations = await location.list({ type });
        } else {
          locations = await location.list();
        }

        return locations;
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
    }

    /**
     * Bulk update locations.  This might be a combination of add and update.
     * The data will be coming from wdw.
     *
     * @param locations
     */
    @Post('/locations')
    public async batchUpsertLocations(
      @Body() locations: any[]
    ): Promise<{}> {
      try {
        return await location.addUpdateLocations(locations);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
    }

    /**
     * Retrieves a single location
     */
    @Get('/locations/:id')
    public async getLocation(
      @Param('id') id: string
    ): Promise<{}> {
      let found;

      try {
        logger.debug(`Searching for location ${id}`);
        found = await location.get(id);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Location ${id} does not exist.`);
      }

      logger.debug(`Found location ${id}, returning.`);
      return found;
    }

    /**
     * Retrieves a single location's activities
     */
    @Get('/locations/:id/activities')
    public async getLocationActivities(
      @Param('id') id: string
    ): Promise<{}> {
      let found;

      try {
        logger.debug(`Searching for activities for location ${id}`);
        found = await location.get(id, ['activities']);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Location ${id} does not exist.`);
      }

      logger.debug(`Found location ${id}, returning activities.`);

      const activities = found.activities;
      return activities;
    }

    /**
     * Retrieves a single location's schedule by date
     */
    @Get('/locations/:id/schedules/:date')
    public async getLocationSchedule(
      @Param('id') id: string,
      @Param('date') date: string
    ): Promise<{}> {
      let found;

      try {
        logger.debug(`Searching for schedules for location ${id} on ${date}`);
        found = await location.getLocationSchedule(id, date);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Location ${id} does not exist.`);
      }

      logger.debug(`Found location ${id}, returning.`);
      return found;
    }
  }

  return LocationController;
};
