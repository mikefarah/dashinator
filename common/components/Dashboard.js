import React, { PropTypes } from 'react';
import FailureList from './FailureList';
import Gauge from './Gauge';
import Counter from './Counter';
import RickshawGraph from './RickshawGraph';

const Dashboard = ({ connection, testEnvs, production, ci, kitchenSink, heapGraph }) => (
  <div className='dashboard'>
    <div className={ `connectionAlert ${connection}` }>Connection Lost</div>
    <div className='columnContainer'>
      <div className='rowContainer'>
        <FailureList name='Production' state={ production } />
        { kitchenSink &&
            <RickshawGraph
            name='Heap size'
            series={[{ name: 'heapGraph', data: heapGraph.data }]}
            formatString='0.0 b'/>
        }
      </div>
      <div className='rowContainer'>
        <FailureList name='Test Environments' state={ testEnvs } />
        { kitchenSink &&
          <Gauge className='monthlyTarget' name='Monthly Target'
            value={testEnvs.elapsed * 3} max={90} unit='apples'/>
        }
      </div>
      <div className='rowContainer'>
        <FailureList name='CI' state={ ci } />
        { kitchenSink &&
          <Counter name='Open tickets' value={testEnvs.elapsed}/>
        }
      </div>
    </div>
  </div>
);

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  testEnvs: React.PropTypes.object.isRequired,
  production: React.PropTypes.object.isRequired,
  ci: React.PropTypes.object.isRequired,
  kitchenSink: React.PropTypes.bool,
  heapGraph: React.PropTypes.object.isRequired,
};

export default Dashboard;
