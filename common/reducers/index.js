import { combineReducers } from 'redux';
import connection from './connection';
import * as FailureListActions from './failureLists';

const rootReducer = combineReducers(
  Object.assign({}, { connection }, FailureListActions.default));

export default rootReducer;
