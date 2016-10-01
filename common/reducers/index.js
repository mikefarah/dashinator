import { combineReducers } from 'redux';
import connection from './connection';
import { testEnvs, production } from './failureLists';

const rootReducer = combineReducers({
  connection,
  testEnvs,
  production,
});

export default rootReducer;
