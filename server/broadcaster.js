import socketIo from 'socket.io';
import winston from 'winston';

class Broadcaster {

  constructor() {
    this.connections = [];
  }

  attach(server) {
    const io = socketIo();
    io.attach(server);
    io.on('connection', socket => this.addSocket(socket));
  }

  addSocket(socket) {
    this.connections.push(socket);
    socket.on('disconnect', () => {
      const index = this.connections.indexOf(socket);
      this.connections.splice(index, 1);
    });
  }

  broadcast(action) {
    winston.info('Broadcasting', action);
    this.connections.forEach(socket => socket.emit('action', action));
  }

}

module.exports = Broadcaster;
