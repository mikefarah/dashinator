const updateFailureList = updateListCategory => (state = {
  failures: [],
}, action) => {
  if (action.type === updateListCategory) {
    return Object.assign({}, state, {
      failures: action.failures,
      description: action.description,
    });
  }
  return state;
};

const testEnvs = updateFailureList('updateTestEnvs');
const production = updateFailureList('updateProduction');
const ci = updateFailureList('updateCi');

module.exports = {
  testEnvs,
  production,
  ci,
};
