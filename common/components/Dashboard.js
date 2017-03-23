import React, { PropTypes } from 'react';
import { AbsoluteFragment as Fragment } from 'redux-little-router';
import FailureList from './FailureList';
import Gauge from './Gauge';
import Counter from './Counter';
import RickshawGraph from './RickshawGraph';
import Title from './Title';

const Dashboard = ({ connection, testEnvs, production, ci, kitchenSink, graphs, title }) => (
  <div className='dashboard'>
    <div className={ `connectionAlert ${connection}` }>Connection Lost</div>
    <Title titleText={ title } />
    <div className='pages'>
    <Fragment forRoute='/'>
      <div className='columnContainer'>
      <div className='rowContainer'>
        <FailureList name='Production' state={ production } />
        { kitchenSink &&
            <RickshawGraph
            name='Heap'
            series={graphs.heapGraph.series}
            formatString='0.0 b'
            errorThreshold={162295552}
            xAxisFormat='HH:MM:ss'/>
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
    </Fragment>
    <Fragment forRoute='/extra'>
      <div className='columnContainer'>
        <div className='rowContainer'>
          <FailureList name='Some more widgets' state={ ci } />
        </div>
      </div>
    </Fragment>
    </div>
  </div>
);

Dashboard.propTypes = {
  connection: PropTypes.string.isRequired,
  testEnvs: React.PropTypes.object.isRequired,
  production: React.PropTypes.object.isRequired,
  ci: React.PropTypes.object.isRequired,
  kitchenSink: React.PropTypes.bool,
  graphs: React.PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default Dashboard;
