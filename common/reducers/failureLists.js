const updateFailureList = environment => (state = {
  failures: [],
}, action) => {
  if (action.type === environment) {
    return Object.assign({}, state, {
      failures: action.failures,
    });
  }
  return state;
};

const testEnvs = updateFailureList('updateTestEnvs');
const production = updateFailureList('updateProduction');

module.exports = {
  testEnvs,
  production,
};
