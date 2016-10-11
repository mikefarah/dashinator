import _ from 'lodash';
import winston from 'winston';
import checkServiceHealth from './checkServiceHealth';

const intervalMs = 20000;

class EnvironmentHealthChecks {
  constructor(connections, actionType, servers) {
    this.connections = connections;
    this.actionType = actionType;
    this.failures = [];
    this.count = 0;
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
    winston.info('Broadcasting', this.failures);
    this.connections.forEach((socket) => {
      socket.emit('action', {
        type: this.actionType,
        failures: this.failures,
      });
    });
  }
}

module.exports = EnvironmentHealthChecks;
