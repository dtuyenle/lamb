/* eslint-disable */
const webpack = require('webpack');
const merge = require('webpack-merge');
const fs = require('fs');
const path = require('path');
const common = require('./webpack.common.js');
// const TerserPlugin = require('terser-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* eslint-enable */

const serverConfig = merge(common.serverConfig, {
  mode: 'production',
  // optimization: {
  //   minimizer: [new TerserPlugin({ parallel: false })],
  // },
});

const browserConfig = merge(common.browserConfig, {
  mode: 'production',
  // optimization: {
  //   minimizer: [new TerserPlugin({ parallel: false })],
  // },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
});

module.exports = [
  browserConfig,
  serverConfig,
];
