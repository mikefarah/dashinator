import React, { PropTypes } from 'react';
import truncate from 'truncate';

const Failure = ({ name, url, reason }) => (
  <div className='failure'>
    <a href={ url || '#'}>
      <div className='name'>{ name }</div>
      <div className='reason'>{truncate(reason, 60)}</div>
    </a>
  </div>
);

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  reason: PropTypes.string,
};

export default Failure;
