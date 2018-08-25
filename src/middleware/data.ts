import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { response } from 'wdw-data';

/**
 * Interceptor to check if we are returning symbols from our data later.  Converts
 * it into a format that is better understood by the web.
 */
@Interceptor()
export default class NameCorrectionInterceptor implements InterceptorInterface {
  public intercept(action: Action, content: any) {
    if (content && content[response.Error]) {
      action.context.status = 400;
      return content[response.Error];
    }

    if (content && content[response.Success]) {
      return content[response.Success];
    }

    return content;
  }
}
