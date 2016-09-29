import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FailureList from '../components/FailureList';
import * as CounterActions from '../actions';

const mapStateToProps = state => ({
  connection: state.connection,
  name: state.testEnvironments.name,
  failures: state.testEnvironments.failures,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FailureList);
