import _ from 'lodash';
import winstonStub from '../winstonStub';

import Monitor from '../../server/monitor';

jest.useFakeTimers();
jest.mock('winston', () => winstonStub);

describe('Monitor', () => {
  let runCheck;
  const broadcasterStub = {
    broadcast: jest.fn(),
  };

  const actionType = 'updateSomething';
  let monitor;

  beforeEach(() => {
    runCheck = jest.fn(() => Promise.resolve());
    monitor = new Monitor(broadcasterStub, actionType, runCheck);
  });

  describe('monitor', () => {
    beforeEach(() => {
      monitor.updateState = jest.fn();
    });

    context('runCheck succeeds', () => {
      const state = {
        results: [{ name: 'test', url: 'somewere', status: 'OK' }],
        description: 'sweet',
      };

      beforeEach(() => {
        runCheck.mockImplementation(() => Promise.resolve(state));
        return monitor.monitor();
      });

      it('calls runCheck', () => {
        expect(runCheck.mock.calls.length).toEqual(1);
      });

      it('updates the state the new state', () => {
        const actual = _.omit(monitor.updateState.mock.calls[0][0], ['elapsed']);
        expect(actual).toEqual(_.omit(state, ['elapsed']));
      });

      it('calculates the elapsed time', () => {
        expect(monitor.updateState.mock.calls[0][0].elapsed).toBeGreaterThanOrEqual(0);
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(runCheck.mock.calls.length).toEqual(2);
      });
    });

    context('runCheck fails', () => {
      beforeEach(() => {
        runCheck.mockImplementation(() => Promise.reject(new Error('badness')));
        return monitor.monitor();
      });

      it('updates the state with an error', () => {
        expect(monitor.updateState).toBeCalledWith({
          results: [{ name: 'badness', status: 'Exception', url: '#' }],
        });
      });

      it('schedules to call itself', () => {
        jest.runOnlyPendingTimers();
        expect(runCheck.mock.calls.length).toEqual(2);
      });
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

    const state = {
      results: [serverResults1, serverResults2],
      description: 'checking things!',
    };

    beforeEach(() => {
      monitor.broadcast = jest.fn();
      monitor.updateState(state);
    });

    it('sets the failures property to the failed health checks', () => {
      expect(monitor.failures).toEqual([serverResults2]);
    });

    it('sets the description', () => {
      expect(monitor.description).toEqual(state.description);
    });

    it('calls broadcast to broadcast the results', () => {
      expect(monitor.broadcast.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('broadcast', () => {
    const failures = ['badness'];

    beforeEach(() => {
      monitor.failures = failures;
      monitor.broadcast();
    });

    it('broadcasts the update action', () => {
      expect(broadcasterStub.broadcast).toBeCalledWith({
        type: actionType,
        failures,
      });
    });
  });
});
