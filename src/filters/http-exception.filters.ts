import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import log from '../log';

interface IError {
  message: string;
  meta?: any;
  status: number;
  timeStamp: string;
}

const buildError = (message, status, timeStamp, meta?) => {
  const error: IError = {
    message: message || 'Uh oh! Something evil happend.',
    status,
    timeStamp
  };

  if (meta) {
    error.meta = meta;
  }

  return error;
};

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    log.error(
      `${request.method} ${request.url} ${status} -  ${exception.message}: ${exception.stack}`
    );

    response
      .status(status)
      .json({
        errors: [buildError(exception.message, status || 500, new Date().toISOString())]
      });
  }
}

export default HttpExceptionFilter;
