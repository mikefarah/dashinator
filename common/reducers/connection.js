const connection = (state = 'connected', action) => {
  if (action.type === 'updateConnection') {
    return action.status;
  }
  return state;
};

export default connection;
