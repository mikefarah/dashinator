import React, { PropTypes } from 'react';
import reactCSS from 'reactcss';
import Failure from './Failure';


const FailureList = ({ name, failures }) => {
  const styles = reactCSS({
    default: {
      container: {
        transition: 'background-color 2s',
        background: 'green',
        height: '100%',
        display: 'flex',
        borderRadius: '5px',
      },
      content: {
        margin: 'auto',
      },
      list: {
        listStyle: 'none',
        paddingTop: '10px',
        paddingLeft: '0px',
      },
      title: {
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '32px',
      },
    },
    failure: {
      container: {
        background: 'red',
      },
    },
  }, {
    failure: failures.length > 0,
  });

  return <div style={ styles.container }>
           <div style={ styles.content }>
             <span style={ styles.title }>{ name }</span>
             <ul style={ styles.list }>
               { failures.map(f => <Failure key={ `${f.name}-${f.url}` } name={ f.name } url={ f.url } />) }
             </ul>
           </div>
         </div>;
};

FailureList.propTypes = {
  name: PropTypes.string.isRequired,
  failures: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

export default FailureList;
