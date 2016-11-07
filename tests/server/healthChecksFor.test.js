import sinon from 'sinon';
import 'sinon-as-promised';
import winstonStub from '../winstonStub';

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
    healthChecksFor.__Rewire__('winston', winstonStub);
    healthCheck = healthChecksFor(services);
  });

  context('service is healthy', () => {
    it('returns OK', () => healthCheck()
      .then(state => expect(state).toEqual({
        results: [
          {
            name: 'my service',
            status: 'OK',
            url: 'http://blah',
          }],
        description: 'Monitoring 1 service(s)',
      })
    ));
  });

  context('service fails with a bad response', () => {
    let error;

    beforeEach(() => {
      error = new Error('bad response');
      error.response = {
        statusCode: 503,
        body: 'Forbidden!',
      };
      requestStub.reset().rejects(error);
    });

    it('returns the error message', () => healthCheck()
      .then(state => expect(state).toEqual({
        results: [
          {
            name: 'my service',
            status: '503 - Forbidden!',
            url: 'http://blah',
          }],
        description: 'Monitoring 1 service(s)',
      })
    ));
  });

  context('service fails', () => {
    beforeEach(() => {
      requestStub.reset().rejects(new Error('no'));
    });

    it('returns the error message', () => healthCheck()
      .then(state => expect(state).toEqual({
        results: [
          {
            name: 'my service',
            status: 'no',
            url: 'http://blah',
          }],
        description: 'Monitoring 1 service(s)',
      })
    ));
  });
});
