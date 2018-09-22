import cluster from 'cluster';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import { cpus } from 'os';
import 'reflect-metadata';
import { useKoaServer } from 'routing-controllers';
import { createModels } from 'wdw-data';
import zlib from 'zlib';
import config from './config/index';
import logger from './log';
import dataInterceptor from './middleware/data';
import loggingMiddleware from './middleware/logging';
import activityController from './modules/activity/Controller';
import diningController from './modules/dining/Controller';
import locationController from './modules/location/Controller';
import shopController from './modules/shop/Controller';
import statusController from './modules/status/Controller';

const numCPUs = cpus().length;

if (cluster.isMaster) {
  logger.info(`This machine has ${numCPUs} CPUs.`);
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    logger.info(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    logger.info('Starting a new worker...');
    cluster.fork();
  });
} else {
  createModels(
    {
      database: 'wdw',
      logging: false,
      pool: {
        max: 100 // TODO: only here because we are kicking off a shit ton of async inserts
      },
      username: 'tylercvetan',
    },
    logger
  )
    .then(models => {
      const app = new Koa();

      useKoaServer(app, {
        controllers: [
          activityController(models),
          diningController(models),
          locationController(models),
          shopController(models),
          statusController(models)
        ],
        cors: true,
        defaultErrorHandler: false,
        interceptors: [dataInterceptor],
        middlewares: [loggingMiddleware(config, logger)]
      });

      app.use(bodyParser());
      app.use(compress({ flush: zlib.Z_SYNC_FLUSH }));

      app.listen(config.port);

      const envLabel = process.env.NODE_ENV || 'development';
      logger.info(`Started server instance on port ${config.port} in ${envLabel} environment at ${new Date().toLocaleString()} (localtime).`); // tslint:disable-line
    });
}
