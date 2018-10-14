import { Controller, Get } from '@nestjs/common';

@Controller()
class StatusController {
  /**
   * Retrieves a service schema that was built with a specific application.
   */
  @Get('/health')
  public async status(): Promise<string> {
    return 'Services online.';
  }
}

export default StatusController;
