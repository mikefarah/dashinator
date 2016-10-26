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
    return this.runCheck()
      .then(state => this.updateState(state))
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
    this.broadcast();
  }

  getState() {
    return _.pick(this, ['failures', 'description']);
  }

  broadcast() {
    this.broadcaster.broadcast({
      type: this.actionType,
      failures: this.failures,
      description: this.description,
    });
  }
}

module.exports = Monitor;
