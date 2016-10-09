import React, { PropTypes } from 'react';

const Failure = ({ name, url }) => (
  <div className='failure'>
    <a href={ url }>
      { name }
    </a>
  </div>
);

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Failure;
