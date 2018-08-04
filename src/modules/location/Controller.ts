import {
  BadRequestError,
  // Controller,
  Get,
  InternalServerError,
  JsonController,
  Param
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
    public async getAllLocations(): Promise<{}> {
      try {
        const locations = await location.list();
        return locations;
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
  }

  return LocationController;
};
