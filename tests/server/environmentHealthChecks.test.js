import sinon from 'sinon';
import 'sinon-as-promised';

import EnvironmentHealthChecks from '../../server/environmentHealthChecks';

jest.useFakeTimers();

describe('EnvironmentHealthChecks', () => {
  const checkServiceHealthStub = sinon.stub().resolves();
  const connection = {
    emit: sinon.stub(),
  };
  const connections = [connection];
  const actionType = 'updateSomething';
  let environmentHealthChecks;
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
    EnvironmentHealthChecks.__Rewire__('checkServiceHealth', checkServiceHealthStub);
    EnvironmentHealthChecks.__Rewire__('winston', {
      error: sinon.stub(),
      info: sinon.stub(),
    });
    environmentHealthChecks = new EnvironmentHealthChecks(connections, actionType, servers);
  });

  describe('monitor', () => {
    context('checkHealth succeeds', () => {
      beforeEach(() => {
        environmentHealthChecks.checkHealth = sinon.stub().resolves();
        return environmentHealthChecks.monitor();
      });

      it('calls checkHealth', () => {
        expect(environmentHealthChecks.checkHealth.callCount).toEqual(1);
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(environmentHealthChecks.checkHealth.callCount).toEqual(2);
      });
    });

    context('checkHealth fails', () => {
      beforeEach(() => {
        environmentHealthChecks.checkHealth = sinon.stub().rejects(new Error('badness'));
        return environmentHealthChecks.monitor();
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(environmentHealthChecks.checkHealth.callCount).toEqual(2);
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
      environmentHealthChecks.updateState = sinon.stub();
      return environmentHealthChecks.checkHealth();
    });

    it('checks the health of the services', () => {
      expect(checkServiceHealthStub.firstCall.args).toEqual([server1]);
    });

    it('calls updateState with the health status', () => {
      const updateStateArgs = environmentHealthChecks.updateState.firstCall.args;
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
      environmentHealthChecks.broadcast = sinon.stub();
      environmentHealthChecks.updateState(results);
    });

    it('sets the failures property to the failed health checks', () => {
      expect(environmentHealthChecks.failures).toEqual([serverResults2]);
    });

    it('calls broadcast to broadcast the results', () => {
      expect(environmentHealthChecks.broadcast.called).toEqual(true);
    });
  });

  describe('broadcast', () => {
    const failures = ['badness'];

    beforeEach(() => {
      environmentHealthChecks.failures = failures;
      environmentHealthChecks.broadcast();
    });

    it('emits the current state to the connected sockets', () => {
      expect(connection.emit.firstCall.args).toEqual(['action', {
        type: actionType,
        failures,
      }]);
    });
  });
});
