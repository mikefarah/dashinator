import { combineReducers } from 'redux';
import connection from './connection';
import kitchenSink from './kitchenSink';
import * as FailureListActions from './failureLists';

const rootReducer = combineReducers(
  Object.assign({}, { connection, kitchenSink }, FailureListActions.default));

export default rootReducer;
