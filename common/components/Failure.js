import React, { PropTypes } from 'react';
import truncate from 'truncate';

const Failure = ({ name, url, reason }) => (
  <div className='failure'>
    <a href={ url || '#'}>
      <div className='name'>{ name }</div>
      <div className='reason'>{truncate(reason, 60)}</div>
      <p className='tooltip'>{reason}</p>
    </a>
  </div>
);

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  reason: PropTypes.string,
};

export default Failure;
