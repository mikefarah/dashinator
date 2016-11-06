import React, { PropTypes } from 'react';
import FailureList from './FailureList';
import Gauge from './Gauge';
import Counter from './Counter';

const Dashboard = ({ connection, testEnvs, production, ci }) => (
  <div className='dashboard'>
    <div className={ `connectionAlert ${connection}` }>Connection Lost</div>
    <div className='columnContainer'>
      <div className='rowContainer'>
        <FailureList name='Production' state={ production } />
      </div>
      <div className='rowContainer'>
        <FailureList name='Test Environments' state={ testEnvs } />
        <Gauge name='Monthly Target' value={testEnvs.elapsed * 3} max={90} unit='apples'/>
      </div>
      <div className='rowContainer'>
        <FailureList name='CI' state={ ci } />
        <Counter name='Open tickets' value={testEnvs.elapsed}/>
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
