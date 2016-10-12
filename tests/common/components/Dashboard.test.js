import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from '../../../common/components/Dashboard';

describe('Dashboard', () => {
  let dashboard;

  beforeEach(() => {
    dashboard = shallow(
      <Dashboard
        testEnvs={ { failures: [] } }
        production={ { failures: [] } }
        connection='disconnected'
      />
    );
  });

  it('sets the connection status on the connection alert', () => {
    expect(dashboard.find('.connectionAlert.disconnected').length).toEqual(1);
  });
});