import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import tenantController from '../../../src/modules/location/Controller';

chai.use(chaiAsPromised);

describe('controller', () => {
  describe('locations', () => {
    describe('getAllLocations', () => {
      it('should return all locations', async () => {
        const mockModel = {
          location: {
            list: () => [{
              id: 'foo'
            }]
          }
        };

        const Controller = tenantController(mockModel);
        const controller = new Controller();
        const response = await controller.getAllLocations();
        expect(response).to.deep.equal([{ id: 'foo' }]);
      });
    });
  });
});
