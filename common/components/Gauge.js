import React, { PropTypes } from 'react';
import _ from 'lodash';
import ChartistGraph from 'react-chartist';

const Gauge = ({ name, value, description, max = 100 }) => {
  const data = {
    series: [{
      className: 'gauge-fill',
      value: _.clamp((value / max) * 100, 0, 100),
    }, {
      className: 'gauge-empty',
      value: _.clamp(((max - value) / max) * 100, 0, 100),
    }],
  };

  const options = {
    donut: true,
    donutWidth: 40,
    startAngle: 240,
    total: 150,
    showLabel: false,
  };

  return (<div className='gauge'>
        <div className='content'>
          <ChartistGraph data={data} options={options} type='Pie' />
          <div className='name'>{name}</div>
        </div>
        <div className='footer'>
          <span className='description'>{ description }</span>
        </div>
      </div>);
};

Gauge.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  description: PropTypes.string,
  max: PropTypes.number,
};

export default Gauge;
