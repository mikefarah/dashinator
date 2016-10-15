import React, { PropTypes } from 'react';
import FailureList from './FailureList';

const Dashboard = ({ connection, testEnvs, production, ci }) => (
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
        <FailureList failures={ ci.failures } name='CI' />
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
  ci: PropTypes.shape({
    failures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default Dashboard;
