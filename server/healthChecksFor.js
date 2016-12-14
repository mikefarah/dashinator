import request from 'request-promise-native';
import winston from 'winston';

const checkServiceHealth = service => request(Object.assign({
  uri: service.url,
  resolveWithFullResponse: true,
}, service.requestOptions))
  .then(() => 'OK')
  .catch((err) => {
    winston.warn(`Error checking ${service.url}`, err);
    if (err.response) {
      return `${err.response.statusCode} - ${err.response.body}`;
    }
    return err.message.replace(/^Error: /, '');
  })
  .then(status => Object.assign({}, service, {
    status,
  }));

const healthChecksFor = servers => () =>
  Promise.all(servers.map(s => checkServiceHealth(s)))
    .then(results => ({
      results,
      description: `Monitoring ${servers.length} service(s)`,
    }));

module.exports = healthChecksFor;
