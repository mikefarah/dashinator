import sinon from 'sinon';
import 'sinon-as-promised';

import healthChecksFor from '../../server/healthChecksFor';

describe('healthChecksFor', () => {
  const services = [{
    name: 'my service',
    url: 'http://blah',
  }];
  let requestStub;

  let healthCheck;

  beforeEach(() => {
    requestStub = sinon.stub().resolves();
    healthChecksFor.__Rewire__('request', requestStub);
    healthCheck = healthChecksFor(services);
  });

  context('service is healthy', () => {
    it('returns OK', () => healthCheck()
      .then(results => expect(results).toEqual([
        {
          name: 'my service',
          status: 'OK',
          url: 'http://blah',
        }]
      )
    ));
  });

  context('service fails', () => {
    beforeEach(() => {
      requestStub.reset().rejects(new Error('no'));
    });

    it('returns the error message', () => healthCheck()
      .then(results => expect(results).toEqual([
        {
          name: 'my service',
          status: 'no',
          url: 'http://blah',
        }]
      )
    ));
  });
});
