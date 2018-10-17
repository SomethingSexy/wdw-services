import {
  ArgumentMetadata,
  Injectable,
  PipeTransform
} from '@nestjs/common';

@Injectable()
class ParseBooleanPipe implements PipeTransform<string, boolean> {
  public transform(value: string, _: ArgumentMetadata): boolean {
    const val = Boolean(value);
    return val;
  }
}

export default ParseBooleanPipe;
