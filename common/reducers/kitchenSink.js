const kitchenSink = (state = false, action) => {
  if (action.type === 'updateKitchenSink') {
    return action.value;
  }
  return state;
};

export default kitchenSink;
