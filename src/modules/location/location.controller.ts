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

@Controller()
class LocationController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}

  /**
   * Retrieves all locations
   */
  @Get('/locations')
  public async getAllLocations(
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
        locations = await this.models.location.list(where);
      } else {
        locations = await this.models.location.list();
      }

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
  @Post('/locations')
  public async batchUpsertLocations(
    @Body() locations: any[]
  ): Promise<{}> {
    try {
      return await this.models.location.addUpdate(locations);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
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
      found = await this.models.location.get(id);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
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
      found = await this.models.location.get(id, ['activities']);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning activities.`);

    const activities = found.activities;
    return activities;
  }

  @Post('/locations/:id/schedules')
  public async addSchedules(
    @Param('id') id: string,
    @Body() schedules: any[]
  ): Promise<{}> {
    try {
      return await this.models.location.addSchedules(id, schedules);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
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
      found = await this.models.location.getLocationSchedule(id, date);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning.`);
    return found;
  }
}

export default LocationController;
