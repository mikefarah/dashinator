import React from 'react';
import { shallow } from 'enzyme';

import Failure from '../../../common/components/Failure';

describe('Failure', () => {
  let failureComponent;

  beforeEach(() => {
    failureComponent = shallow(<Failure name='test' url='http://blah' />);
  });

  it("has a 'failure' class name for styling", () => {
    expect(failureComponent.find('.failure').length).toEqual(1);
  });

  it('includes a link', () => {
    expect(failureComponent.contains(
      <a href='http://blah'>test</a>
    )).toEqual(true);
  });
});
