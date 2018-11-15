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
class ParkController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}

  /**
   * Retrieves all locations
   */
  @Get('/parks')
  public async getAllLocations(
    @Query('fetchSchedule', new ParseBooleanPipe()) fetchSchedule?: boolean
  ): Promise<{}> {
    try {
      const where: { type?: string; fetchSchedule?: boolean; } = { type: 'theme-park' };
      if (fetchSchedule) {
        where.fetchSchedule = true;
      }

      const locations = await this.models.park.list(where);

      return locations;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Bulk update locations.  This might be a combination of add and update.
   * The data will be coming from wdw.
   *
   * @param locations
   */
  @Post('/parks')
  public async batchUpsertLocations(
    @Body() locations: any[]
  ): Promise<{}> {
    try {
      return await this.models.park.bulkAddUpdate(locations);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Retrieves a single location
   */
  @Get('/parks/:id')
  public async getLocation(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for location ${id}`);
      found = await this.models.park.findById(id);
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
  @Get('/parks/:id/activities')
  public async getLocationActivities(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for activities for location ${id}`);
      found = await this.models.park.findById(id, ['activities']);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning activities.`);

    return found.data.activities;
  }

  /**
   * Retrieves a single location's dining
   */
  @Get('/parks/:id/dining')
  public async getLocationDining(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for dining for location ${id}`);
      found = await this.models.park.findById(id, ['dining']);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning dining.`);

    return found.data.dining;
  }

  @Post('/parks/:id/schedules')
  public async addSchedules(
    @Param('id') id: string,
    @Body() schedule: {}
  ): Promise<{}> {
    try {
      const found = await this.models.park.findById(id);
      logger.debug(`controller ${JSON.stringify(schedule, null, 4)}`);
      return await found.bulkAddSchedules(schedule);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Retrieves a single location's schedule by date
   */
  @Get('/parks/:id/schedules/:date')
  public async getLocationSchedule(
    @Param('id') id: string,
    @Param('date') date: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for schedules for location ${id} on ${date}`);
      found = await this.models.park.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!found) {
      throw new BadRequestException(`Location ${id} does not exist.`);
    }

    logger.debug(`Found location ${id}, returning.`);

    const schedules = await found.getSchedule(date);
    return schedules;
  }
}

export default ParkController;
