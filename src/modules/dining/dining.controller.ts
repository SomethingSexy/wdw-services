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
class DiningController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}
  /**
   * Retrieves all dining
   */
  @Get('/dining')
  public async getAllDining(
    @Query('type') type?: string
  ): Promise<{}> {
    try {
      const list = type ? await this.models.dining.list({ type }) : await this.models.dining.list();
      return list;
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Bulk update dining.  This might be a combination of add and update.
   * The data will be coming from wdw.
   *
   * @param dining
   */
  @Post('/dining')
  public async batchUpsertDining(
    @Body() bulk: any[]
  ): Promise<{}> {
    try {
      return await this.models.dining.addUpdate(bulk);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Retrieves a single dining
   */
  @Get('/dining/:id')
  public async getDining(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for dining ${id}`);
      found = await this.models.dining.get(id);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Dining ${id} does not exist.`);
    }

    logger.debug(`Found dining ${id}, returning.`);
    return found;
  }
}

export default DiningController;
