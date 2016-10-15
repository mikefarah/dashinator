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
      .then(results => this.updateState(results))
      .then(() => setTimeout(() => this.monitor(), intervalMs))
      .catch((err) => {
        winston.error(err);
        this.updateState([{ name: err.message, status: 'Exception', url: '#' }]);
        setTimeout(() => this.monitor(), intervalMs);
      });
  }

  updateState(results) {
    this.failures = _.reject(results, s => s.status === 'OK');
    this.broadcast();
  }

  broadcast() {
    this.broadcaster.broadcast({
      type: this.actionType,
      failures: this.failures,
    });
  }
}

module.exports = Monitor;
