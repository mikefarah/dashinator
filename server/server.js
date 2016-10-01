import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import socketIo from 'socket.io';

import webpackConfig from '../webpack.config';

import EnvironmentHealthChecks from './EnvironmentHealthChecks';
import handleRender from './renderer';

const app = new Express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

const connections = [];

const testEnvironments = new EnvironmentHealthChecks(connections, 'updateTestEnvironmentFailures', [
  {
    name: 'simple http listener',
    url: 'http://localhost:9999',
  },
  {
    name: 'another thing',
    url: 'http://localhost:9999',
  },
]);

const preloadedState = () => ({
  testEnvironments: {
    failures: testEnvironments.failures,
  },
});

app.use(handleRender(preloadedState));

const server = app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==>  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

const io = socketIo();
io.attach(server);

io.on('connection', (socket) => {
  connections.push(socket);

  socket.on('disconnect', () => {
    const index = connections.indexOf(socket);
    connections.splice(index, 1);
  });
});
