
class EnvironmentHealthChecks {
  constructor(connections, actionType) {
    this.connections = connections;
    this.actionType = actionType;
    this.failures = [];
    this.count = 0;
    setInterval(() => this.updateState(), 1000);
  }

  updateState() {
    this.count = this.count + 1;
    this.failures = [{
      name: `My cool server (${this.count})`,
      url: 'http://healthcheck',
    }];
    this.broadcast();
  }

  broadcast() {
    this.connections.forEach((socket) => {
      socket.emit('action', {
        type: this.actionType,
        failures: this.failures,
      });
    });
  }
}


module.exports = EnvironmentHealthChecks;
