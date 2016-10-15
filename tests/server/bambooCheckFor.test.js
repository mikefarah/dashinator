import sinon from 'sinon';
import 'sinon-as-promised';
import winstonStub from '../winstonStub';

import bambooCheckFor from '../../server/bambooCheckFor';

describe('bambooCheckFor', () => {
  let requestStub;
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
    requestStub = sinon.stub().resolves();
    bambooCheckFor.__Rewire__('request', requestStub);
    bambooCheckFor.__Rewire__('winston', winstonStub);
    bambooCheck = bambooCheckFor(bambooConfig);
  });

  context('build successful', () => {
    beforeEach(() => {
      requestStub.reset().resolves(bambooResultFor('Successful'));
    });

    it('returns an OK status', () =>
      bambooCheck().then(results =>
          expect(results).toEqual([{
            name: 'My Plan',
            status: 'OK',
            url: 'http://base/browse/ABC-1234',
          }])
      )
    );

    it('makes a request with the config provided', () =>
      bambooCheck().then(() =>
          expect(requestStub.firstCall.args).toEqual([{
            json: true,
            url: 'http://base/rest/api/latest/result/blah?os_authType=basic&max-result=1',
            auth: {
              user: 'fred',
              password: '1234',
            },
          }])
      ));
  });

  context('build failed', () => {
    beforeEach(() => {
      requestStub.reset().resolves(bambooResultFor('FAILED'));
    });

    it('returns the failure status', () =>
      bambooCheck().then(results =>
          expect(results).toEqual([{
            name: 'My Plan',
            status: 'FAILED',
            url: 'http://base/browse/ABC-1234',
          }])
      )
    );
  });

  context('exception accessing bamboo', () => {
    beforeEach(() => {
      requestStub.reset().rejects(new Error('Access Denied'));
    });

    it('returns the exceptiom details', () =>
      bambooCheck().then(results =>
          expect(results).toEqual([{
            name: 'Access Denied',
            status: 'Exception',
            url: '#',
          }])
      )
    );
  });
});
