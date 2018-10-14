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
class ShopController {
  constructor(
    @Inject('Models')
    private readonly models: any, // TODO need to pull interface
  ) {}
  /**
   * Retrieves all shops
   */
  @Get('/shops')
  public async getAllShops(
    @Query('type') type?: string
  ): Promise<{}> {
    try {
      const list = type ? await this.models.shop.list({ type }) : await this.models.shop.list();

      return list;
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Bulk update shops.  This might be a combination of add and update.
   * The data will be coming from wdw.
   *
   * @param shop
   */
  @Post('/shops')
  public async batchUpsertShops(
    @Body() bulk: any[]
  ): Promise<{}> {
    try {
      return await this.models.shop.addUpdate(bulk);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Retrieves a single shop
   */
  @Get('/shops/:id')
  public async getShops(
    @Param('id') id: string
  ): Promise<{}> {
    let found;

    try {
      logger.debug(`Searching for shop ${id}`);
      found = await this.models.shop.get(id);
    } catch ({ message, code }) {
      throw new InternalServerErrorException(message);
    }
    if (!found) {
      throw new BadRequestException(`Shop ${id} does not exist.`);
    }

    logger.debug(`Found shop ${id}, returning.`);
    return found;
  }
}

export default ShopController;
