import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import Controller from '../../../src/modules/activity/activity.controller';

chai.use(chaiAsPromised);

describe('controller', () => {
  describe('activities', () => {
    describe('batchUpsertActivities', () => {
      it('should return an array of activites that were updated', async () => {
        const activity1 = { extId: '123', type: 'entertainment', name: 'foo' };
        const activity2 = { extId: '456', type: 'attraction', name: 'woot' };
        const activities = [activity1, activity2];
        const updatedActivity = [{ ...activity1, id: '1' }, { ...activity2, id: '2' }];

        const mockModel = {
          activity: {
            addUpdate: () => updatedActivity
          }
        };

        const controller = new Controller(mockModel);
        const response = await controller.batchUpsertActivities(activities);
        expect(response).to.deep.equal(updatedActivity);
      });
    });
  });
});
