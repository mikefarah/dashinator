import sinon from 'sinon';
import winstonStub from '../winstonStub';
import Broadcaster from '../../server/broadcaster';

describe('Broadcaster', () => {
  const socket = {
    emit: sinon.stub(),
    on: sinon.stub(),
  };

  let ioStub;

  let broadcaster;

  function stubSocketIo() {
    ioStub = {
      attach: sinon.stub(),
      on: sinon.stub(),
    };
    const socketIo = sinon.stub().returns(ioStub);
    Broadcaster.__Rewire__('socketIo', socketIo);
  }

  beforeEach(() => {
    stubSocketIo();
    Broadcaster.__Rewire__('winston', winstonStub);
    broadcaster = new Broadcaster();
  });

  describe('attach', () => {
    const server = {
      express: 'server',
    };

    beforeEach(() => {
      broadcaster.addSocket = sinon.stub();
      broadcaster.attach(server);
    });
    it('attaches socket io to the server', () => {
      expect(ioStub.attach.firstCall.args).toEqual([server]);
    });

    it('listens to connection events', () => {
      expect(ioStub.on.firstCall.args[0]).toEqual('connection');
    });

    context('a socket connection is made', () => {
      beforeEach(() => {
        ioStub.on.yield(socket);
      });

      it('delegates to addSocket', () => {
        expect(broadcaster.addSocket.firstCall.args).toEqual([socket]);
      });
    });
  });

  describe('addSocket', () => {
    beforeEach(() => {
      broadcaster.addSocket(socket);
    });

    it('adds the socket to the connections', () => {
      expect(broadcaster.connections).toEqual([socket]);
    });

    it('listens to socket disconnect events', () => {
      expect(socket.on.firstCall.args[0]).toEqual('disconnect');
    });

    context('a socket is disconnected from the server', () => {
      beforeEach(() => {
        socket.on.yield();
      });

      it('removes the socket from connections', () => {
        expect(broadcaster.connections).toEqual([]);
      });
    });
  });

  describe('broadcast', () => {
    const action = {
      something: 'great',
    };

    beforeEach(() => {
      broadcaster.addSocket(socket);
      broadcaster.broadcast(action);
    });

    it('emits the action to the connected sockets', () => {
      expect(socket.emit.firstCall.args).toEqual(['action', action]);
    });
  });
});
