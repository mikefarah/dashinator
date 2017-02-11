const title = (state = null, action) => {
  if (action.type === 'updateTitle') {
    return action.value;
  }
  return state;
};

export default title;
