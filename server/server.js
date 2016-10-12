import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import lessMiddleware from 'less-middleware';
import winston from 'winston';
import Yaml from 'yamljs';

import webpackConfig from '../webpack.config';

import HealthChecks from './healthChecks';
import handleRender from './renderer';
import Broadcaster from './broadcaster';

const broadcaster = new Broadcaster();

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

const dashboardConfig = Yaml.load('./dashboard-config.yaml');

const productionEnvironment = new HealthChecks(
  broadcaster,
  'updateProduction',
  dashboardConfig.productionEnvironment);

productionEnvironment.monitor();

const testEnvs = new HealthChecks(
  broadcaster,
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

broadcaster.attach(server);

