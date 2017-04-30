/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.NODE_ENV || 'development';
var prod = env === 'prod' || env === 'production';

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  }),
  new ExtractTextPlugin('styles.css')
];

if (prod) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    })
  );
}

module.exports = {
  devtool: prod ? false : 'cheap-module-eval-source-map',
  entry: ['./app/public/src/js/index'],
  output: {
    path: path.join(__dirname, '/app/public/dist'),
    filename: 'bundle.js'
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        include: path.join(__dirname, 'app'),
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'app/public/src/css'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true', 'sass-loader', 'postcss-loader']
        })
      }
    ]
  },
};
