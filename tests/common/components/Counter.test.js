import React from 'react';
import { mount } from 'enzyme';

import Counter from '../../../common/components/Counter';

jest.useFakeTimers();

describe('Counter', () => {
  let counter;

  beforeEach(() => {
    counter = mount(<Counter name='test' value={30} unit='seconds' />);
  });

  it('renders the name', () => {
    expect(counter.find('.name').text()).toEqual('test');
  });

  it('renders the unit', () => {
    expect(counter.find('.unit').text()).toEqual('seconds');
  });

  it('renders the value', () => {
    expect(counter.find('.value').text()).toEqual('30');
  });

  context('updating the value', () => {
    beforeEach(() => {
      counter.setProps({ value: 40 });
      jest.runAllTimers();
    });

    it('renders the value', () => {
      expect(counter.find('.value').text()).toEqual('40');
    });
  });
});
