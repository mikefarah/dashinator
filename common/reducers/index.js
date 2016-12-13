import { combineReducers } from 'redux';
import connection from './connection';
import kitchenSink from './kitchenSink';
import heapGraph from './heapGraph';
import * as FailureListActions from './failureLists';

const rootReducer = combineReducers(
  Object.assign({}, { connection, kitchenSink, heapGraph }, FailureListActions.default));

export default rootReducer;
