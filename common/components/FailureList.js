import React, { PropTypes } from 'react';
import Failure from './Failure';

const FailureList = ({ name, state }) => (
  <div className={ `failureList ${state.failures.length ? 'has-failures' : 'no-failures'}` }>
    <div className='content'>
      <span className='title'>{ name }</span>
      <div className='list'>
        { state.failures.map(f => <Failure key={ `${f.name}-${f.url}` } name={ f.name } url={ f.url } />) }
      </div>
    </div>
      <div className='footer'>
        { state.description }
      </div>
  </div>
);

FailureList.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.shape({
    description: PropTypes.string,
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default FailureList;
