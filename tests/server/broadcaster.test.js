import socketIoStub from 'socket.io';
import winstonStub from '../winstonStub';
import Broadcaster from '../../server/broadcaster';

jest.mock('winston', () => winstonStub);

jest.mock('socket.io');

describe('Broadcaster', () => {
  let socket;
  let broadcaster;
  let ioStub;

  beforeEach(() => {
    broadcaster = new Broadcaster();
    ioStub = {
      attach: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
    };
    socketIoStub.mockImplementation(() => ioStub);

    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };
  });

  describe('attach', () => {
    const server = {
      express: 'server',
    };

    beforeEach(() => {
      ioStub.on.mockImplementation((event, handleFunc) => handleFunc(socket));
      broadcaster.addSocket = jest.fn();
      broadcaster.attach(server);
    });

    it('attaches socket io to the server', () => {
      expect(ioStub.attach).toBeCalledWith(server);
    });

    it('listens to connection events', () => {
      expect(ioStub.on.mock.calls[0][0]).toEqual('connection');
    });

    it('delegates to addSocket when a connection occurs', () => {
      expect(broadcaster.addSocket).toBeCalledWith(socket);
    });
  });

  describe('addSocket', () => {
    let disconnectFunction;
    beforeEach(() => {
      socket.on.mockImplementation((event, handleFunc) => (disconnectFunction = handleFunc));
      broadcaster.addSocket(socket);
    });

    it('adds the socket to the connections', () => {
      expect(broadcaster.connections).toEqual([socket]);
    });

    it('listens to socket disconnect events', () => {
      expect(socket.on.mock.calls[0][0]).toEqual('disconnect');
    });

    context('socket disconnects', () => {
      beforeEach(() => disconnectFunction());

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
      expect(socket.emit).toBeCalledWith('action', action);
    });
  });
});
