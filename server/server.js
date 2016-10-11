import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import lessMiddleware from 'less-middleware';
import winston from 'winston';
import socketIo from 'socket.io';
import Yaml from 'yamljs';

import webpackConfig from '../webpack.config';

import EnvironmentHealthChecks from './environmentHealthChecks';
import handleRender from './renderer';

const app = new Express();
app.use(lessMiddleware('public'));
app.use(Express.static('public'));

const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

const connections = [];

const dashboardConfig = Yaml.load('./dashboard-config.yaml');

const productionEnvironment = new EnvironmentHealthChecks(
  connections,
  'updateProduction',
  dashboardConfig.productionEnvironment);

productionEnvironment.monitor();

const testEnvs = new EnvironmentHealthChecks(
  connections,
  'updateTestEnvs',
  dashboardConfig.testEnvironments);

testEnvs.monitor();

const preloadedState = () => ({
  testEnvs: {
    failures: testEnvs.failures,
  },
  production: {
    failures: productionEnvironment.failures,
  },
});

app.use(handleRender(preloadedState));

const server = app.listen(port, (error) => {
  if (error) {
    winston.error(error);
  } else {
    winston.info(`==>  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
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
