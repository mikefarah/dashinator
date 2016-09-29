const testEnvironments = (state = {
    name: 'test',
    failures: [],
  } , action) => {
  if (action.type == 'update') {
    return action.testEnvironments;
  }
  return state;
};

export default testEnvironments;
