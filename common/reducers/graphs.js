import _ from 'lodash';

const graphs = (state = { graphs: {} }, action) => {
  if (action.type === 'updateGraph') {
    return Object.assign({}, state, { [action.name]: _.omit(action, ['name', 'type']) });
  }
  return state;
};

export default graphs;
