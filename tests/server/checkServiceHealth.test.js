import sinon from 'sinon';
import 'sinon-as-promised';

import checkServiceHealth from '../../server/checkServiceHealth';

describe('checkServiceHealth', () => {
  const service = {
    name: 'my service',
    url: 'http://blah',
  };
  let requestStub;

  beforeEach(() => {
    requestStub = sinon.stub().resolves();
    checkServiceHealth.__Rewire__('request', requestStub);
  });

  context('service is healthy', () => {
    it('returns OK', () => checkServiceHealth(service)
      .then(result => expect(result).toEqual(
        {
          name: 'my service',
          status: 'OK',
          url: 'http://blah',
        }
      )
    ));
  });

  context('service fails', () => {
    beforeEach(() => {
      requestStub.reset().rejects(new Error('no'));
    });

    it('returns the error message', () => checkServiceHealth(service)
      .then(result => expect(result).toEqual(
        {
          name: 'my service',
          status: 'no',
          url: 'http://blah',
        }
      )
    ));
  });
});
