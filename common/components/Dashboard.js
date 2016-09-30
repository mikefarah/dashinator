import React, { Component, PropTypes } from 'react'
import FailureList from './FailureList'
import reactCSS from 'reactcss'

const Dashboard = ({connection, testEnvironments}) => {
  const styles = reactCSS({
    default: {
      dashboard: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      },
      column: {
        textAlign: 'center',
        height: 'calc(100vh - 10px)',
        width: '100%',
        flexGrow: 1,
        margin: '5px',
      },
      alert: {
        display: 'none',
      }
    },
    disconnected: {
      alert: {
        display: 'block',
        position: 'absolute',
        width: 'calc(100% - 10px)',
        background: 'black',
        textAlign: 'center',
        padding: '30px 0px 30px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
        color: 'white',
        fontSize: '30px',
        margin: '20px 5px 0px 5px',
      },
    },
  }, {
    disconnected: connection === 'disconnected'
  });

  return <div>
           <div style={ styles.alert }>Connection Lost</div>
           <ul style={ styles.dashboard }>
             <li style={ styles.column }>
               <FailureList failures={ [] } name='Prod' />
             </li>
             <li style={ styles.column }>
               <FailureList failures={ testEnvironments.failures } name='Test Environments' />
             </li>
           </ul>
         </div>
}

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  testEnvironments: PropTypes.shape({
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
}

export default Dashboard