import React, { Component, PropTypes } from 'react'
import reactCSS from 'reactcss'

const Failure = ({name, url}) => {
  const styles = reactCSS({
    'default': {
      link: {
        textDecoration: 'none',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }
    }
  });

  return <div>
           <a href={ url } style={ styles.link }>
             <p>
               { name }
             </p>
           </a>
         </div>
}

Failure.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default Failure