import _ from 'lodash';
import winston from 'winston';

const intervalMs = 20000;

class Monitor {
  constructor(broadcaster, actionType, runCheck) {
    this.broadcaster = broadcaster;
    this.actionType = actionType;
    this.failures = [];
    this.runCheck = runCheck;
  }

  monitor() {
    const startTime = Date.now();
    return this.runCheck()
      .then((state) => {
        const elapsed = Date.now() - startTime;
        this.updateState(Object.assign({}, state, { elapsed }));
      })
      .then(() => setTimeout(() => this.monitor(), intervalMs))
      .catch((err) => {
        winston.error(err);
        this.updateState({ results: [{ name: err.message, status: 'Exception', url: '#' }] });
        setTimeout(() => this.monitor(), intervalMs);
      });
  }

  updateState(state) {
    this.failures = _.reject(state.results, s => s.status === 'OK');
    this.description = state.description;
    this.elapsed = state.elapsed;
    this.broadcast();
  }

  getState() {
    return _.pick(this, ['failures', 'description', 'elapsed']);
  }

  broadcast() {
    this.broadcaster.broadcast(Object.assign({ type: this.actionType }, this.getState()));
  }
}

module.exports = Monitor;
