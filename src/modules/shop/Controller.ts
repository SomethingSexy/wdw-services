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
 * Controllers for everything shop releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
export default ({ shop }) => {
  @JsonController()
  class ShopController {
    /**
     * Retrieves all shops
     */
    @Get('/shops')
    public async getAllShops(
      @QueryParam('type') type?: string
    ): Promise<{}> {
      try {
        let list;
        if (type) { // tslint:disable-line
          list = await shop.list({ type });
        } else {
          list = await shop.list();
        }

        return list;
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        return await shop.addUpdate(bulk);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        found = await shop.get(id);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Shop ${id} does not exist.`);
      }

      logger.debug(`Found shop ${id}, returning.`);
      return found;
    }
  }

  return ShopController;
};
