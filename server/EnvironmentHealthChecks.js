import request from 'request-promise-native';
import _ from 'lodash';

const checkServiceHealth = service => request({
  uri: service.url,
  resolveWithFullResponse: true,
})
  .then(() => 200) // normalise success to 200
  .catch(err => (err.response ? err.response.statusCode : 500))
  .then(statusCode => Object.assign({}, service, {
    statusCode,
  }));


class EnvironmentHealthChecks {
  constructor(connections, actionType, servers) {
    this.connections = connections;
    this.actionType = actionType;
    this.failures = [];
    this.count = 0;
    this.servers = servers;
    this.checkHealth();
  }

  checkHealth() {
    console.log('Checking health');
    Promise.all(this.servers.map(s => checkServiceHealth(s)))
      .then(results => this.updateState(results))
      .then(() => setTimeout(() => this.checkHealth(), 1000));
  }

  updateState(results) {
    this.failures = _.reject(results, s => s.statusCode === 200);
    this.broadcast();
  }

  broadcast() {
    console.log('Broadcasting', this.failures);
    this.connections.forEach((socket) => {
      socket.emit('action', {
        type: this.actionType,
        failures: this.failures,
      });
    });
  }
}


module.exports = EnvironmentHealthChecks;
