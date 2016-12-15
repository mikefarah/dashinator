import request from 'request-promise-native';
import winston from 'winston';
import _ from 'lodash';
import fs from 'fs';

const requestFor = (service) => {
  const requestOptions = Object.assign({
    uri: service.url,
    resolveWithFullResponse: true,
  }, service.requestOptions);

  ['ca', 'key', 'cert'].forEach((field) => {
    const filePath = _.get(requestOptions, `agentOptions.${field}File`);
    if (filePath) {
      requestOptions.agentOptions[field] = fs.readFileSync(filePath);
    }
  });
  winston.info(`Checking service health of ${service.name}`);
  return request(requestOptions);
};

const checkServiceHealth = service => requestFor(service)
  .then(() => 'OK')
  .catch((err) => {
    winston.warn(`Error checking ${service.url}`, err);
    if (err.response) {
      return `${err.response.statusCode} - ${err.response.body}`;
    }
    return err.message.replace(/^Error: /, '');
  })
  .then(status => Object.assign({}, _.pick(service, ['name', 'url']), {
    status,
  }));

const healthChecksFor = servers => () =>
  Promise.all(servers.map(s => checkServiceHealth(s)))
    .then(results => ({
      results,
      description: `Monitoring ${servers.length} service(s)`,
    }));

module.exports = healthChecksFor;
