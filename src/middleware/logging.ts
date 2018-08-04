import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { IServerConfig } from '../types';

export default (_: IServerConfig, logger) => {
  @Middleware({ type: 'before' })
  class LoggingMiddleware implements KoaMiddlewareInterface {
    public async use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      try {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        logger.log('info', `${context.method} ${context.url} ${context.status} - ${ms}ms`);
      } catch (error) {
        logger.log(
          'error',
          `${context.method} ${context.url} ${error.httpCode} -  ${error.message}`
        );
        context.throw(error.httpCode, error.message);
      }
    }
  }

  return LoggingMiddleware;
};
