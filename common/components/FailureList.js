import React, { PropTypes } from 'react';
import Failure from './Failure';

const FailureList = ({ name, failures }) => (
  <div className={ `failureList ${failures.length ? 'has-failures' : 'no-failures'}` }>
    <div>
      <span className='title'>{ name }</span>
      <ul>
        { failures.map(f => <Failure key={ `${f.name}-${f.url}` } name={ f.name } url={ f.url } />) }
      </ul>
    </div>
  </div>
);

FailureList.propTypes = {
  name: PropTypes.string.isRequired,
  failures: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

export default FailureList;
