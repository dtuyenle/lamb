/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-enable */

const DIST = path.resolve(__dirname, 'dist');
const SRC = path.resolve(__dirname, 'src');

const serverConfig = {
  entry: {
    uiServer: `${SRC}/ui/server/index.js`,
  },
  output: {
    filename: '[name].js',
    path: `${DIST}/lambchop`,
    libraryTarget: 'commonjs2',
  },
  optimization: {
    usedExports: true,
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({ __isBrowser__: 'false' }),
  ],
  module: {
    rules: [
      // We use raw-loader to load css as a string from cap-ui into inject_global
      // from styled-components
      {
        test: /\.css$/,
        use: 'raw-loader',
      },
      {
        test: /\.jsx?/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['airbnb'],
            plugins: ['source-map-support', 'babel-plugin-root-import', 'babel-plugin-styled-components'],
            ignore: ['node_modules/is_js'],
          },
        },
        exclude: /node_modules\/(?!cap-ui)/,
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|ico)/,
        exclude: /node_modules\/(?!cap-ui)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[name]-[hash].[ext]',
          },
        }],
      },
    ],
  },
};

const browserConfig = {
  entry: {
    lambchopBrowser: ['babel-polyfill', `${SRC}/ui/browser/index.js`],
  },
  output: {
    path: `${DIST}/public/lambchop/assets`,
    filename: '[name].js',
  },
  target: 'web',
  optimization: {
    usedExports: true,
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/assets']),
    new ManifestPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({ __isBrowser__: 'true' }),
  ],
  module: {
    rules: [
      // We use raw-loader to load css as a string from cap-ui into inject_global
      // from styled-components
      {
        test: /\.css$/,
        use: 'raw-loader',
      },
      {
        test: /\.jsx?/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['airbnb'],
            plugins: ['babel-plugin-transform-async-to-promises', 'source-map-support', 'babel-plugin-root-import', 'babel-plugin-styled-components'],
            ignore: ['node_modules/is_js'],
          },
        },
        exclude: /node_modules\/(?!cap-ui|react-rasta|query-string|strict-uri-encode)/,
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)/,
        exclude: /node_modules\/(?!cap-ui)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[name]-[hash].[ext]',
          },
        }],
      },
    ],
  },
};

module.exports = {
  browserConfig,
  serverConfig,
};
