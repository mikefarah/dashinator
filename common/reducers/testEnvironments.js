const testEnvironments = (state = {
    failures: [],
  } , action) => {
  if (action.type == 'update') {
    return action.testEnvironments;
  }
  return state;
};

export default testEnvironments;
