import { Get, JsonController } from 'routing-controllers';

/**
 * Controller for returning the status of the services
 */
export default (_: any) => {
  @JsonController()
  class StatusController {
    /**
     * Retrieves a service schema that was built with a specific application.
     */
    @Get('/health')
    public async status(): Promise<string> {
      return 'Services online.';
    }
  }

  return StatusController;
};
