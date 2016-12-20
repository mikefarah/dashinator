import React, { PropTypes } from 'react';
import humanizeDuration from 'humanize-duration';
import Failure from './Failure';

const FailureList = ({ name, state }) => (
  <div className={ `failureList ${state.failures.length ? 'has-failures' : 'no-failures'}` }>
    <div className='content'>
      <span className='title'>{ name }</span>
      <div className='list'>
        { state.failures.map(f => <Failure key={ `${f.name}-${f.url}-${f.status}` } name={ f.name } reason={f.status} url={ f.url } />) }
      </div>
    </div>
      <div className='footer'>
        <span className='description'>{ state.description }</span>
        <div><small className='elapsed'>in {humanizeDuration(state.elapsed)}</small></div>
      </div>
  </div>
);

FailureList.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.shape({
    description: PropTypes.string,
    elapsed: React.PropTypes.number,
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    })).isRequired,
  }).isRequired,
};

export default FailureList;
