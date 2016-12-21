const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: __dirname,
      query: {
        presets: ['react-hmre'],
        plugins: ['rewire'],
      },
    }],
  },
};
