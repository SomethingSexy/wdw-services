import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { map } from 'rxjs/operators';
import { response } from 'wdw-data';

export interface IResponse<T> {
  data: T;
}

@Injectable()
class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>> {
  public intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<IResponse<T>> {
    return call$.pipe(map(data => {
      if (data && data[response.Error]) {
        const contextResponse = context.switchToHttp().getResponse();
        contextResponse.status = 400;
        return data[response.Error];
      }

      if (data && data[response.Success]) {
        return data[response.Success];
      }

      return data;
    }));
  }
}

export default TransformInterceptor;
