import React from 'react';
import Rickshaw from 'rickshaw';
import _ from 'lodash';
import dateformat from 'dateformat';
import Counter from './Counter';

const colorScheme = [
  '#17941f',
  '#ff8000',
  '#ffcc00',
  '#b35a00',
  '#6b006b',
  '#80c9ff',
  '#aa80ff',
  '#ff0000',
  '#808080',
  '#b38f00',
  '#8fb300',
  '#b30000',
  '#bebebe',
  '#80ff80',
  '#ffc080',
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
      renderer: this.props.renderer || 'line',
    });

    const resize = () => {
      if (this.graph) {
        this.graph.setSize();
        this.graph.render();
      }
    };

    window.addEventListener('resize', _.debounce(resize, 300));

    this.graphLegend = new Rickshaw.Graph.Legend({
      graph: this.graph, element: this.legend,
    });

    const xAxis = new Rickshaw.Graph.Axis.X({
      graph: this.graph,
      tickFormat: (x) => {
        const date = new Date(x * 1000);
        return dateformat(date, this.props.xAxisFormat);
      },
    });
    xAxis.render();

    const yAxis = new Rickshaw.Graph.Axis.Y({
      graph: this.graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    });

    // eslint-disable-next-line no-new
    new Rickshaw.Graph.HoverDetail({
      graph: this.graph,
      formatter(series, x, y) {
        const rawDate = new Date(x * 1000);
        const date = `<span class="date">${dateformat(rawDate, 'dS mmmm yyyy, h:MM:ss TT')}</span>`;
        const swatch = `<span class="rickshaw_detail_swatch" style="background-color: ${series.color}"></span>`;
        const content = `${swatch}${series.name}: ${y.toFixed(2)} <br> ${date}`;
        return content;
      },
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
      this.graph.series = this.getSeriesWithColors();
      this.graph.series.active = () => this.graph.series.filter(s => !s.disabled);
      this.graph.update();
      this.graphLegend.render();
    }
  }

  maxValue() {
    if (this.props.series) {
      return _.chain(this.props.series)
                .map(s => _.last(s.data))
                .sortBy(d => d.x)
                .map(d => d.y)
                .last()
                .value() || 0;
    }
    return 0;
  }

  className() {
    if (this.props.errorThreshold && this.maxValue() > this.props.errorThreshold) {
      return 'rickshaw-graph failure';
    }
    return 'rickshaw-graph';
  }

  render() {
    let counter = <div/>;
    if (!this.props.hideCounter) {
      counter = <Counter value={this.maxValue()} formatString={this.props.formatString}/>;
    }

    return (
      <div className={this.className()}>
        <div className='content'>
          <div className='title'>{this.props.name}</div>
          {counter}
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
  hideCounter: React.PropTypes.string,
  formatString: React.PropTypes.string,
  renderer: React.PropTypes.string,
  errorThreshold: React.PropTypes.number,
  xAxisFormat: React.PropTypes.string,
};
module.exports = RickshawGraph;
