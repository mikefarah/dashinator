const heapGraph = (state = { data: [] }, action) => {
  if (action.type === 'updateHeapGraph') {
    return { data: action.data };
  }
  return state;
};

export default heapGraph;
