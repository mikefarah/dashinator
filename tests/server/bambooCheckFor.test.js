import requestStub from 'request-promise-native';
import winstonStub from '../winstonStub';
import bambooCheckFor from '../../server/bambooCheckFor';

jest.mock('winston', () => winstonStub);
jest.mock('request-promise-native', () => jest.fn(() => Promise.resolve()));

describe('bambooCheckFor', () => {
  let bambooCheck;

  const bambooConfig = {
    plans: ['blah'],
    baseUrl: 'http://base',
    requestOptions: {
      auth: {
        user: 'fred',
        password: '1234',
      },
    },
  };

  const bambooResultFor = buildState => ({
    results: {
      result: [{
        plan: {
          shortName: 'My Plan',
        },
        buildState,
        buildResultKey: 'ABC-1234',
      }],
    },
  });

  beforeEach(() => {
    bambooCheck = bambooCheckFor(bambooConfig);
  });

  context('build successful', () => {
    beforeEach(() => {
      requestStub.mockImplementation(() => Promise.resolve(bambooResultFor('Successful')));
    });

    it('returns an OK status', () =>
      bambooCheck().then(state =>
          expect(state).toEqual({
            results: [{
              name: 'My Plan',
              status: 'OK',
              url: 'http://base/browse/ABC-1234',
            }],
            description: 'Monitoring 1 bamboo plan(s)' })
      )
    );

    it('makes a request with the config provided', () =>
      bambooCheck().then(() =>
          expect(requestStub).toBeCalledWith({
            json: true,
            url: 'http://base/rest/api/latest/result/blah?os_authType=basic&max-result=1',
            auth: {
              user: 'fred',
              password: '1234',
            },
          })
      ));
  });

  context('build failed', () => {
    beforeEach(() => {
      requestStub.mockImplementation(() => Promise.resolve(bambooResultFor('FAILED')));
    });

    it('returns the failure status', () =>
      bambooCheck().then(state =>
          expect(state).toEqual({ results: [{
            name: 'My Plan',
            status: 'FAILED',
            url: 'http://base/browse/ABC-1234',
          }],
            description: 'Monitoring 1 bamboo plan(s)' })
      )
    );
  });

  context('exception accessing bamboo', () => {
    beforeEach(() => {
      requestStub.mockImplementation(() => Promise.reject(new Error('Access Denied')));
    });

    it('returns the exceptiom details', () =>
      bambooCheck().then(state =>
          expect(state.results).toEqual([{
            name: 'Access Denied',
            status: 'Exception',
            url: '#',
          }])
      )
    );
  });
});
