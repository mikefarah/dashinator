const winston = require('winston');
const request = require('request-promise-native');

const checkLatestBuild = (bambooConfig, plan) => {
  const requestOptions = Object.assign({}, bambooConfig.requestOptions, {
    json: true,
    url: `${bambooConfig.baseUrl}/rest/api/latest/result/${plan}?os_authType=basic&max-result=1`,
  });
  return request(requestOptions)
    .then((response) => {
      const result = response.results.result[0];
      const name = result.plan.shortName;
      const status = result.buildState === 'Successful' ? 'OK' : result.buildState;
      const url = `${bambooConfig.baseUrl}/browse/${result.buildResultKey}`;
      return { name, url, status };
    })
    .catch((err) => {
      winston.error(`Error accessing bamboo plan ${plan} with config ${JSON.stringify(bambooConfig)}`, err);
      return { name: err.message, url: '#', status: 'Exception' };
    });
};

const bambooCheckFor = bambooConfig => () =>
  Promise.all(bambooConfig.plans.map(plan => checkLatestBuild(bambooConfig, plan)))
    .then(results => ({
      results,
      description: `Monitoring ${bambooConfig.plans.length} bamboo plan(s)`,
    }));

module.exports = bambooCheckFor;
