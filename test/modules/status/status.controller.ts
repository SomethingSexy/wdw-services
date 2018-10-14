import { expect } from 'chai';
import 'mocha';
import Controller from '../../../src/modules/status/status.controller';

describe('controller', () => {
  describe('status', () => {
    it('should return health string', async () => {
      const controller = new Controller();

      expect(await controller.status()).to.equal('Services online.');
    });
  });
});
