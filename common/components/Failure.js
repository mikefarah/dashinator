import React, { PropTypes } from 'react';

const Failure = ({ name, url }) => (
  <li className='failure'>
    <a href={ url }>
      { name }
    </a>
  </li>
);

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Failure;
