import { combineReducers } from 'redux';
import connection from './connection';
import testEnvironments from './testEnvironments';

const rootReducer = combineReducers({
  connection,
  testEnvironments,
});

export default rootReducer;
