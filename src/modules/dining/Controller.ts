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
 * Controllers for everything dining releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 */
export default ({ dining }) => {
  @JsonController()
  class DiningController {
    /**
     * Retrieves all dining
     */
    @Get('/dining')
    public async getAllDining(
      @QueryParam('type') type?: string
    ): Promise<{}> {
      try {
        let list;
        if (type) { // tslint:disable-line
          list = await dining.list({ type });
        } else {
          list = await dining.list();
        }

        return list;
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        return await dining.addUpdate(bulk);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
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
        found = await dining.get(id);
      } catch ({ message, code }) {
        throw new InternalServerError(message);
      }
      if (!found) {
        throw new BadRequestError(`Dining ${id} does not exist.`);
      }

      logger.debug(`Found dining ${id}, returning.`);
      return found;
    }
  }

  return DiningController;
};
