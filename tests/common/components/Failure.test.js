import React from 'react';
import { shallow } from 'enzyme';

import Failure from '../../../common/components/Failure';

describe('Failure', () => {
  let failureComponent;

  beforeEach(() => {
    failureComponent = shallow(<Failure name='test' url='http://blah' reason='because'/>);
  });

  it("has a 'failure' class name for styling", () => {
    expect(failureComponent.find('.failure').length).toEqual(1);
  });

  it('renders the link', () => {
    expect(failureComponent.find('a').prop('href')).toEqual('http://blah');
  });

  it('renders the name', () => {
    expect(failureComponent.find('a .name').text()).toEqual('test');
  });

  it('renders the reason', () => {
    expect(failureComponent.find('a .reason').text()).toEqual('because');
  });
});
