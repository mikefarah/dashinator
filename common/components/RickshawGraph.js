import React from 'react';
import Rickshaw from 'rickshaw';
import _ from 'lodash';
import dateformat from 'dateformat';
import Counter from './Counter';

const colorScheme = [
  '#00cc00',
  '#ff8000',
  '#ffcc00',
  '#330099',
  '#990099',
  '#ccff00',
  '#ff0000',
  '#808080',
  '#008f00',
  '#00487d',
  '#b35a00',
  '#b38f00',
  '#6b006b',
  '#8fb300',
  '#b30000',
  '#bebebe',
  '#80ff80',
  '#80c9ff',
  '#ffc080',
  '#ffe680',
  '#aa80ff',
  '#ee00cc',
  '#ff8080',
  '#666600',
  '#ffbfff',
  '#00ffcc',
  '#cc6699',
  '#999900',
];

class RickshawGraph extends React.Component {
  componentDidMount() {
    this.graph = new Rickshaw.Graph({
      element: this.chartContainer,
      series: this.getSeriesWithColors(),
      renderer: 'line',
    });

    // eslint-disable-next-line no-new
    new Rickshaw.Graph.Legend({
      graph: this.graph, element: this.legend,
    });

    const xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      tickFormat: (x) => {
        const date = new Date(x * 1000);
        return dateformat(date, 'HH:MM:ss');
      },
    });
    xAxis.render();

    const yAxis = new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    });

    yAxis.render();

    this.graph.render();
  }

  getSeriesWithColors() {
    const palette = new Rickshaw.Color.Palette({ scheme: colorScheme });
    return this.props.series.map(s =>
      Object.assign({ color: palette.color() }, s)
    );
  }

  componentWillUpdate() {
    if (this.graph) {
      this.props.series.forEach((s, index) => {
        this.graph.series[index].data = s.data;
      });
      this.graph.update();
    }
  }

  maxValue() {
    if (this.props.series) {
      return _.chain(this.props.series)
                .map(s => _.last(s.data))
                .map(d => d.y)
                .max()
                .value() || 0;
    }
    return 0;
  }

  className() {
    console.log(`this.props.errorThreshold: ${this.props.errorThreshold}`);
    console.log(`this.maxValue(): ${this.maxValue()}`);
    if (this.props.errorThreshold && this.maxValue() > this.props.errorThreshold) {
      return 'rickshaw-graph failure';
    }
    return 'rickshaw-graph';
  }

  render() {
    return (
      <div className={this.className()}>
        <div className='content'>
          <div className='title'>{this.props.name}</div>
          <Counter value={this.maxValue()} formatString={this.props.formatString}/>
          <div className='chart'
              ref={(container) => { this.chartContainer = container; }}
           />
          <div
            ref={(container) => { this.legend = container; }}
          />
      </div>
      </div>
    );
  }
}

RickshawGraph.propTypes = {
  name: React.PropTypes.string,
  series: React.PropTypes.array,
  formatString: React.PropTypes.string,
  errorThreshold: React.PropTypes.number,
};
module.exports = RickshawGraph;
