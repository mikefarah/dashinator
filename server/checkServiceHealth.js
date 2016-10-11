import request from 'request-promise-native';

const checkServiceHealth = service => request({
  uri: service.url,
  resolveWithFullResponse: true,
})
  .then(() => 'OK')
  .catch(err => err.message)
  .then(status => Object.assign({}, service, {
    status,
  }));

module.exports = checkServiceHealth;
