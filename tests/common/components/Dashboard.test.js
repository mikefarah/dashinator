import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from '../../../common/components/Dashboard';

describe('Dashboard', () => {
  let dashboard;

  context('with the kitchen sink', () => {
    beforeEach(() => {
      dashboard = shallow(
      <Dashboard
        testEnvs={ { failures: [], elapsed: 30 } }
        production={ { failures: [] } }
        ci={ { failures: [] } }
        connection='disconnected'
        heapGraph={{ data: [{ x: 1, y: 2 }] }}
        kitchenSink={true}
      />
      );
    });

    it('renders the counter', () => {
      expect(dashboard.find('Counter').length).toEqual(1);
    });

    it('renders the heapGraph', () => {
      expect(dashboard.find('RickshawGraph').length).toEqual(1);
    });

    it('renders the gauge', () => {
      expect(dashboard.find('.monthlyTarget').length).toEqual(1);
    });
  });

  context('without the kitchen sink', () => {
    beforeEach(() => {
      dashboard = shallow(
      <Dashboard
        testEnvs={ { failures: [], elapsed: 30 } }
        production={ { failures: [] } }
        ci={ { failures: [] } }
        connection='disconnected'
        heapGraph={{ data: [{ x: 1, y: 2 }] }}
      />
      );
    });

    it('sets the connection status on the connection alert', () => {
      expect(dashboard.find('.connectionAlert.disconnected').length).toEqual(1);
    });

    it('does not render a counter', () => {
      expect(dashboard.find('Counter').length).toEqual(0);
    });

    it('does not render a gauge', () => {
      expect(dashboard.find('.monthlyTarget').length).toEqual(0);
    });
  });
});
