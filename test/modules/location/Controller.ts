import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import locationController from '../../../src/modules/location/Controller';

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

        const Controller = locationController(mockModel);
        const controller = new Controller();
        const response = await controller.getAllLocations();
        expect(response).to.deep.equal([{ id: 'foo' }]);
      });
    });

    describe('batchUpsertLocations', () => {
      it('should return an array of locations that were updated', async () => {
        const location1 = { extId: '123', type: 'resort', name: 'foo' };
        const location2 = { extId: '456', type: 'themePark', name: 'woot' };
        const locations = [location1, location2];
        const updatedLocation = [{ ...location1, id: '1' }, { ...location2, id: '2' }];

        const mockModel = {
          location: {
            addUpdateLocations: () => updatedLocation
          }
        };

        const Controller = locationController(mockModel);
        const controller = new Controller();
        const response = await controller.batchUpsertLocations(locations);
        expect(response).to.deep.equal(updatedLocation);
      });
    });
  });
});
