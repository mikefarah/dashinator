import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import lessMiddleware from 'less-middleware';
import winston from 'winston';
import Yaml from 'yamljs';
import gather from 'gather-stream';
import fs from 'fs';
import webpackConfig from '../webpack.config';

import Monitor from './monitor';
import healthChecksFor from './healthChecksFor';
import bambooCheckFor from './bambooCheckFor';
import handleRender from './renderer';
import Broadcaster from './broadcaster';

import HeapGraph from './heapGraph';

const broadcaster = new Broadcaster();

const app = new Express();
app.use(lessMiddleware('public'));

const port = 3000;

if (process.env.NODE_ENV !== 'production') {
  winston.warn('Using webpack HOT-LOADING, this shouldnt happen in prod');
 //  Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.get('*.js', (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.url = `${req.url}.gz`;
    res.set('Content-Encoding', 'gzip');
    next();
  });
}

app.use(Express.static('public'));

function start(configuration) {
  const dashboardConfig = Yaml.parse(configuration);

  const productionHealthChecks = healthChecksFor(dashboardConfig.productionEnvironment);
  const production = new Monitor(broadcaster, 'updateProduction', productionHealthChecks);
  production.monitor();

  const testEnvHealthChecks = healthChecksFor(dashboardConfig.testEnvironments);
  const testEnvs = new Monitor(broadcaster, 'updateTestEnvs', testEnvHealthChecks);
  testEnvs.monitor();

  const bambooCheck = bambooCheckFor(dashboardConfig.bamboo);
  const bamboo = new Monitor(broadcaster, 'updateCi', bambooCheck);
  bamboo.monitor();

  const heapGraph = new HeapGraph(broadcaster);
  heapGraph.monitor();

  const preloadedState = () => ({
    testEnvs: testEnvs.getState(),
    production: production.getState(),
    ci: bamboo.getState(),
    kitchenSink: dashboardConfig.kitchenSink,
    graphs: {
      heapGraph: heapGraph.getState(),
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
}

if (process.argv.length < 3) {
  winston.info('Usage:');
  winston.info('dasher [config.yml | -]');
  winston.info('Note that you can provide the config via stdin if you pass "-"');
  winston.info('\n--Sample config--\n');
  winston.info(fs.readFileSync(`${__dirname}/../sample-dashboard-config.yaml`).toString());
  process.exit(1);
}

const fileArg = process.argv[2];
const stream = fileArg === '-' ? process.stdin : fs.createReadStream(fileArg);
stream.pipe(gather((error, configuration) => {
  if (error) {
    winston.error(error);
    process.exit(1);
  }
  start(configuration.toString());
}));
