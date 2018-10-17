import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import Controller from '../../../src/modules/location/park.controller';

chai.use(chaiAsPromised);

describe('controller', () => {
  describe('park', () => {
    describe('getAllLocations', () => {
      it('should return all locations', async () => {
        const mockModel = {
          park: {
            list: () => [{
              id: 'foo'
            }]
          }
        };

        const controller = new Controller(mockModel);
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
          park: {
            bulkAddUpdate: () => updatedLocation
          }
        };

        const controller = new Controller(mockModel);
        const response = await controller.batchUpsertLocations(locations);
        expect(response).to.deep.equal(updatedLocation);
      });
    });
  });
});
