import React, { PropTypes } from 'react';
import FailureList from './FailureList';

const Dashboard = ({ connection, testEnvs, production, ci }) => (
  <div className='dashboard'>
    <div className={ `connectionAlert ${connection}` }>Connection Lost</div>
    <div className='columnContainer'>
      <div className='rowContainer'>
        <FailureList name='Production' state={ production } />
      </div>
      <div className='rowContainer'>
        <FailureList name='Test Environments' state={ testEnvs } />
      </div>
      <div className='rowContainer'>
        <FailureList name='CI' state={ ci } />
      </div>
    </div>
  </div>
);

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  testEnvs: React.PropTypes.object.isRequired,
  production: React.PropTypes.object.isRequired,
  ci: React.PropTypes.object.isRequired,
};

export default Dashboard;
