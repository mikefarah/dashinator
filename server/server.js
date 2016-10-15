import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import lessMiddleware from 'less-middleware';
import winston from 'winston';
import Yaml from 'yamljs';

import webpackConfig from '../webpack.config';

import Monitor from './monitor';
import healthChecksFor from './healthChecksFor';
import bambooCheckFor from './bambooCheckFor';
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

const dashboardConfig = Yaml.load(process.argv[2]);

const productionHealthChecks = healthChecksFor(dashboardConfig.productionEnvironment);
const production = new Monitor(broadcaster, 'updateProduction', productionHealthChecks);
production.monitor();

const testEnvHealthChecks = healthChecksFor(dashboardConfig.testEnvironments);
const testEnvs = new Monitor(broadcaster, 'updateTestEnvs', testEnvHealthChecks);
testEnvs.monitor();

const bambooCheck = bambooCheckFor(dashboardConfig.bamboo);
const bamboo = new Monitor(broadcaster, 'updateCi', bambooCheck);
bamboo.monitor();

const preloadedState = () => ({
  testEnvs: {
    failures: testEnvs.failures,
  },
  production: {
    failures: production.failures,
  },
  ci: {
    failures: bamboo.failures,
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

