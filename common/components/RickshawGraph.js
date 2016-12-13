import React from 'react';
import Rickshaw from 'rickshaw';
import _ from 'lodash';
import Counter from './Counter';

class RickshawGraph extends React.Component {
  componentDidMount() {
    this.graph = new Rickshaw.Graph({
      element: this.chartContainer,
      series: this.getSeriesWithColors(),
    });

    // eslint-disable-next-line no-new
    new Rickshaw.Graph.Legend({
      graph: this.graph, element: this.legend,
    });

    const xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      tickFormat: x => new Date(x * 1000).toLocaleTimeString(),
      ticksTreatment: 'glow',
    });
    xAxis.render();

    const yAxis = new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: 'glow',
    });

    yAxis.render();

    this.graph.render();
  }

  getSeriesWithColors() {
    const palette = new Rickshaw.Color.Palette({ scheme: 'cool' });
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
                .map(s => s.data)
                .flatten()
                .map(d => d.y)
                .max()
                .value();
    }
    return 0;
  }

  render() {
    return (
      <div className='rickshaw-graph'>
        <div className='content'>
          <div className='name'>{this.props.name}</div>
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
};
module.exports = RickshawGraph;
