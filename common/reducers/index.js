import { combineReducers } from 'redux';
import connection from './connection';
import kitchenSink from './kitchenSink';
import graphs from './graphs';
import title from './title';
import * as FailureListActions from './failureLists';

const rootReducer = combineReducers(
  Object.assign({}, { connection, kitchenSink, graphs, title }, FailureListActions.default));

export default rootReducer;
