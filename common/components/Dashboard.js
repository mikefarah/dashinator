import React, { PropTypes } from 'react';
import FailureList from './FailureList';

const Dashboard = ({ connection, testEnvs, production }) => (
  <div className='dashboard'>
    <div className={ `connectionAlert ${connection}` }>Connection Lost</div>
    <div className='columnContainer'>
      <div className='rowContainer'>
        <FailureList failures={ production.failures } name='Production' />
      </div>
      <div className='rowContainer'>
        <FailureList failures={ testEnvs.failures } name='Test Environments' />
      </div>
      <div className='rowContainer'>
        <FailureList failures={ [] } name='CI' />
        <FailureList failures={ [] } name='Errors' />
      </div>
    </div>
  </div>
);

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  testEnvs: PropTypes.shape({
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  production: PropTypes.shape({
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default Dashboard;
