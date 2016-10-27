import React, { PropTypes } from 'react';

import ChartistGraph from 'react-chartist';

const Gauge = ({ title, value, description, max = 100 }) => {
  const data = {
    series: [{
      className: 'gauge-fill',
      value,
    }, {
      className: 'gauge-empty',
      value: max - value,
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
          <div className='title'>{title}</div>
        </div>
        <div className='footer'>
          <span className='description'>{ description }</span>
        </div>
      </div>);
};

Gauge.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  description: PropTypes.string,
  max: PropTypes.number,
};

export default Gauge;
