import React, { PropTypes } from 'react';
import reactCSS from 'reactcss';

const Failure = ({ name, url }) => {
  const styles = reactCSS({
    default: {
      link: {
        textDecoration: 'none',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
    },
  });

  return <li>
           <a href={ url } style={ styles.link }>
             { name }
           </a>
         </li>;
};

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Failure;
