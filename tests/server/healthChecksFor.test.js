import requestStub from 'request-promise-native';
import winstonStub from '../winstonStub';
import healthChecksFor from '../../server/healthChecksFor';

jest.mock('winston', () => winstonStub);
jest.mock('request-promise-native', () => jest.fn(() => Promise.resolve()));

describe('healthChecksFor', () => {
  const services = [{
    name: 'my service',
    url: 'http://blah',
  }];

  let healthCheck;

  beforeEach(() => {
    healthCheck = healthChecksFor(services);
  });

  context('service is healthy', () => {
    let state;

    beforeEach(() =>
      healthCheck().then(result => (state = result))
    );

    it('returns OK', () => {
      expect(state).toEqual({
        results: [
          {
            name: 'my service',
            status: 'OK',
            url: 'http://blah',
          }],
        description: 'Monitoring 1 service(s)',
      });
    });

    it('makes the request', () => {
      expect(requestStub).toBeCalledWith({
        resolveWithFullResponse: true,
        uri: 'http://blah',
        timeout: 2000,
      });
    });
  });

  context('with request options', () => {
    beforeEach(() =>
      healthChecksFor([{
        name: 'my service with request options',
        url: 'http://whatever',
        requestOptions: { timeout: 3000, auth: { user: 'cat', password: 'dog' } },
      }])());

    it('makes the request with the options', () => {
      expect(requestStub).toBeCalledWith({
        auth: {
          password: 'dog',
          user: 'cat',
        },
        timeout: 3000,
        resolveWithFullResponse: true,
        uri: 'http://whatever',
      });
    });
  });

  context('service fails with a bad response', () => {
    let error;

    beforeEach(() => {
      error = new Error('bad response');
      error.response = {
        statusCode: 503,
        body: 'Forbidden!',
      };
      requestStub.mockImplementation(() => Promise.reject(error));
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
      requestStub.mockImplementation(() => Promise.reject(new Error('no')));
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
