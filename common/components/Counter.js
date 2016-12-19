import React, { PropTypes } from 'react';
import raf from 'raf';
import ease from 'ease-component';
import _ from 'lodash';
import numeral from 'numeral';

const animationTime = 1000;

class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
      begin: props.value,
      end: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value === nextProps.value) {
      return;
    }

    this.setState({
      begin: this.state.currentValue,
      currentValue: this.state.currentValue,
      end: nextProps.value,
    });
    this.startAnimation();
  }

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    this.stop = true;
  }

  startAnimation() {
    this.start = Date.now();
    this.stop = false;
    raf(() => this.animate());
  }

  animate() {
    if (this.stop) return;
    this.draw();
    raf(() => this.animate());
  }

  draw() {
    const begin = this.state.begin;
    const end = this.state.end;

    const now = Date.now();

    if (this.state.currentValue === end || now - this.start >= animationTime) {
      this.stop = true;
    }

    const percentage = _.clamp((now - this.start) / animationTime, 0, 1);
    const easingMultiplier = ease.inOutCirc(percentage);
    const currentValue = begin + ((end - begin) * easingMultiplier);

    this.setState({ currentValue });
  }

  render() {
    return <div className='counter'>
      <div className="content">
      <div className='title'>{this.props.name}</div>
      <div className='value'>
        {numeral(this.state.currentValue).format(this.props.formatString)}
      </div>
      <div className='unit'>{this.props.unit}</div>
      </div>
    </div>;
  }
}

Counter.defaultProps = {
  formatString: '0.0a',
};

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  name: React.PropTypes.string,
  unit: React.PropTypes.string,
  formatString: React.PropTypes.string,
};

module.exports = Counter;
