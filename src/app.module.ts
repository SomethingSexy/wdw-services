import { Module } from '@nestjs/common';
import { createModels } from 'wdw-data';
import logger from './log';
import ActivityController from './modules/activity/activity.controller';
import DiningController from './modules/dining/dining.controller';
import LocationController from './modules/location/location.controller';
import ShopController from './modules/shop/shop.controller';
import StatusController from './modules/status/status.controller';

@Module({
  controllers: [
    ActivityController,
    DiningController,
    LocationController,
    ShopController,
    StatusController
  ],
  providers: [{
    provide: 'Models',
    useFactory: async () => {
      const models = await createModels(
        {
          database: 'wdw',
          logging: false,
          pool: {
            max: 100 // TODO: only here because we are kicking off a shit ton of async inserts
          },
          username: 'tylercvetan',
        },
        logger
      );

      return models;
    },
  }]
})

export default class ApplicationModule {}