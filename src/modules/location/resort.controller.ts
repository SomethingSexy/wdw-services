import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query
} from '@nestjs/common';
import logger from '../../log';
import ParseBooleanPipe from '../../pipes/parse-boolean.pipe';

@Controller()
class ResortController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}

  /**
   * Retrieves all locations
   */
  @Get('/resorts')
  public async getAllLocations(
    @Query('fetchSchedule', new ParseBooleanPipe()) fetchSchedule?: boolean
  ): Promise<{}> {
    try {
      const where: { type?: string; fetchSchedule?: boolean; } = { };
      if (fetchSchedule) {
        where.fetchSchedule = true;
      }

      const locations = await this.models.resort.list(where);

      return locations;
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Bulk update locations.  This might be a combination of add and update.
   * The data will be coming from wdw.
   *
   * @param locations
   */
  @Post('/resorts')
  public async batchUpsertLocations(
    @Body() locations: any[]
  ): Promise<{}> {
    try {
      return await this.models.resort.bulkAddUpdate(locations);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Retrieves a single location
   */
  @Get('/resorts/:id')
  public async getLocation(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for location ${id}`);
      found = await this.models.resort.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning.`);
    return found.data;
  }

  /**
   * Retrieves a single location's activities
   */
  @Get('/resorts/:id/activities')
  public async getLocationActivities(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for activities for location ${id}`);
      found = await this.models.resort.findById(id, ['activities']);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning activities.`);

    return found.data.activities;
  }
}

export default ResortController;
