const MAX_LEN = 20;

const intervalMs = 1000;

const add = (array, timeStamp, value) => {
  array.push({ x: timeStamp, y: value });
  if (array.length > MAX_LEN) {
    array.shift();
  }
};

class HeapGraph {
  constructor(broadcaster) {
    this.broadcaster = broadcaster;
    this.heapUsed = [];
    this.heapTotal = [];
    this.series = [{
      name: 'heapUsed',
      data: this.heapUsed,
    }, {
      name: 'heapTotal',
      data: this.heapTotal,
    }];
  }

  updateState() {
    const memoryUsage = process.memoryUsage();
    const timeStamp = new Date().getTime() / 1000;
    add(this.heapUsed, timeStamp, memoryUsage.heapUsed);
    add(this.heapTotal, timeStamp, memoryUsage.heapTotal);
  }

  monitor() {
    this.updateState();
    this.broadcast();
    setTimeout(() => this.monitor(), intervalMs);
  }

  getState() {
    return { series: this.series };
  }

  broadcast() {
    this.broadcaster.broadcast(Object.assign({ type: 'updateGraph', name: 'heapGraph' }, this.getState()));
  }

}

module.exports = HeapGraph;
