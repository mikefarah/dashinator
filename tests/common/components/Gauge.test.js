import React from 'react';
import { shallow } from 'enzyme';

import Gauge from '../../../common/components/Gauge';

describe('Gauge', () => {
  let gauge;

  beforeEach(() => {
    gauge = shallow(<Gauge title='test' value={30} description='cats' />);
  });

  it('renders the title', () => {
    expect(gauge.find('.title').text()).toEqual('test');
  });

  it('renders the description', () => {
    expect(gauge.find('.description').text()).toEqual('cats');
  });

  it('renders a donut chart', () => {
    expect(gauge.find('.ct-chart-donut')).toBeDefined();
  });
});
