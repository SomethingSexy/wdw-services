import { expect } from 'chai';
import 'mocha';
import statusController from '../../../src/modules/status/Controller';

describe('controller', () => {
  describe('status', () => {
    it('should return health string', async () => {
      const Controller = statusController({});
      const controller = new Controller();

      expect(await controller.status()).to.equal('Services online.');
    });
  });
});
