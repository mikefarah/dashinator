import _ from 'lodash';
import winston from 'winston';
import checkServiceHealth from './checkServiceHealth';

const intervalMs = 20000;

class HealthChecks {
  constructor(broadcaster, actionType, servers) {
    this.broadcaster = broadcaster;
    this.actionType = actionType;
    this.failures = [];
    this.servers = servers;
  }

  monitor() {
    return this.checkHealth()
      .then(() => setTimeout(() => this.monitor(), intervalMs))
      .catch((err) => {
        winston.error(err);
        setTimeout(() => this.monitor(), intervalMs);
      });
  }

  checkHealth() {
    return Promise.all(this.servers.map(s => checkServiceHealth(s)))
      .then(results => this.updateState(results));
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

module.exports = HealthChecks;
