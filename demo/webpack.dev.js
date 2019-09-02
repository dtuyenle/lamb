/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
/* eslint-enable */

const serverConfig = merge(common.serverConfig, {
  mode: 'development',
  // watch: true,
});

const browserConfig = merge(common.browserConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  // watch: true,
});

module.exports = [
  browserConfig,
  serverConfig,
];
