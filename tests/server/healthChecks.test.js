import sinon from 'sinon';
import 'sinon-as-promised';

import winstonStub from '../winstonStub';
import HealthChecks from '../../server/healthChecks';

jest.useFakeTimers();

describe('HealthChecks', () => {
  const checkServiceHealthStub = sinon.stub().resolves();
  const broadcasterStub = {
    broadcast: sinon.stub(),
  };

  const actionType = 'updateSomething';
  let healthChecks;
  const server1 = {
    name: 'server1',
    url: 'http://something1',
  };
  const server2 = {
    name: 'server2',
    url: 'http://something2',
  };
  const servers = [server1, server2];

  beforeEach(() => {
    HealthChecks.__Rewire__('checkServiceHealth', checkServiceHealthStub);
    HealthChecks.__Rewire__('winston', winstonStub);
    healthChecks = new HealthChecks(broadcasterStub, actionType, servers);
  });

  describe('monitor', () => {
    context('checkHealth succeeds', () => {
      beforeEach(() => {
        healthChecks.checkHealth = sinon.stub().resolves();
        return healthChecks.monitor();
      });

      it('calls checkHealth', () => {
        expect(healthChecks.checkHealth.callCount).toEqual(1);
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(healthChecks.checkHealth.callCount).toEqual(2);
      });
    });

    context('checkHealth fails', () => {
      beforeEach(() => {
        healthChecks.checkHealth = sinon.stub().rejects(new Error('badness'));
        return healthChecks.monitor();
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(healthChecks.checkHealth.callCount).toEqual(2);
      });
    });
  });

  describe('checkHealth', () => {
    const healthCheckResults1 = {
      status: 'OK',
    };
    const healthCheckResults2 = {
      status: 'OK 2',
    };

    beforeEach(() => {
      checkServiceHealthStub.reset().returns(healthCheckResults1);
      checkServiceHealthStub.onCall(1).returns(healthCheckResults2);
      healthChecks.updateState = sinon.stub();
      return healthChecks.checkHealth();
    });

    it('checks the health of the services', () => {
      expect(checkServiceHealthStub.firstCall.args).toEqual([server1]);
    });

    it('calls updateState with the health status', () => {
      const updateStateArgs = healthChecks.updateState.firstCall.args;
      expect(updateStateArgs).toEqual([[healthCheckResults1, healthCheckResults2]]);
    });
  });

  describe('updateState', () => {
    const serverResults1 = {
      name: 'serverResults1',
      status: 'OK',
    };
    const serverResults2 = {
      name: 'serverResults2',
      status: 'Failure',
    };

    const results = [serverResults1, serverResults2];

    beforeEach(() => {
      healthChecks.broadcast = sinon.stub();
      healthChecks.updateState(results);
    });

    it('sets the failures property to the failed health checks', () => {
      expect(healthChecks.failures).toEqual([serverResults2]);
    });

    it('calls broadcast to broadcast the results', () => {
      expect(healthChecks.broadcast.called).toEqual(true);
    });
  });

  describe('broadcast', () => {
    const failures = ['badness'];

    beforeEach(() => {
      healthChecks.failures = failures;
      healthChecks.broadcast();
    });

    it('broadcasts the update action', () => {
      expect(broadcasterStub.broadcast.firstCall.args).toEqual([{
        type: actionType,
        failures,
      }]);
    });
  });
});
