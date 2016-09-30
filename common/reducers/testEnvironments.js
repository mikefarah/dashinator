const testEnvironments = (state = {
  failures: [],
}, action) => {
  if (action.type === 'updateTestEnvironmentFailures') {
    return Object.assign({}, state, {
      failures: action.failures,
    });
  }
  return state;
};

export default testEnvironments;
