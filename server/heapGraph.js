
const MAX_LEN = 20;

const intervalMs = 10000;

class HeapGraph {
  constructor(broadcaster) {
    this.broadcaster = broadcaster;
    this.data = [];
  }

  updateState() {
    this.data.push({ x: new Date().getTime() / 1000, y: process.memoryUsage().heapUsed });
    if (this.data.length > MAX_LEN) {
      this.data.shift();
    }
  }

  monitor() {
    this.updateState();
    this.broadcast();
    setTimeout(() => this.monitor(), intervalMs);
  }

  getState() {
    return { data: this.data };
  }

  broadcast() {
    this.broadcaster.broadcast(Object.assign({ type: 'updateHeapGraph' }, this.getState()));
  }

}

module.exports = HeapGraph;
