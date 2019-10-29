import React from 'react';
import path from 'path';
import Lambchop from '../../../../index';
import renderFunction from './helpers/renderFunction';
import rollbarNotifier from './helpers/getRollbar';

// Data fetcher
const getData = async (req, res) => {
  const { pathParameters, headers } = req;
  const { countryCode } = headers;
  const { id } = pathParameters;
  const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({id, value: 'This is test data ' + id + ' ' + countryCode});
    }, 300);
  });
  const data = await fetchData;
  return data;
};

const keyFunction = (req, res) => {
  const { data } = req;
  const { id } = data;
  const key = `lambchop_${id}`;
  return key;
};

const beforeRender = () => {
  return (req, res, next) => {
    const { pathParameters } = req;
    const { id } = pathParameters;
    if (id === '301') {
      res.header('Location', 'http://www.capterra.com');
      return res.status(301).send();
    }
    if (id === '404') {
      return res.status(404).send();
    }
    return next();
  };
};

const config = {
  appName: 'lambchop',
  cache: {
    cacheStoreName: 'Redis',
    keyFunction,
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    ttl: 259200,
    connectionTimeout: 100,
  },
  errorNotifier: rollbarNotifier,
  dataFetcher: getData,
  staticConfig: {
    childPath: path.resolve(__dirname, './uiServer'),
    dataGenerator: async () => {
      const fetchData = new Promise((resolve, reject) => {
        setTimeout(() => {
          const result = [];
          for(let count = 0; count < 100; count++) {
            result.push({id: count, value: 'This is test data ' + count});
          }
          resolve(result);
        }, 3000);
      });
      const data = await fetchData;
      return data;
    },
    folderPath: path.resolve(__dirname, '../static'),
    logFolderPath: path.resolve(__dirname, '../log'),
  },
  render: renderFunction,
};

const app = Lambchop.app(config);

app.injectMiddleware({
  hook: 'beforeRender',
  middleware: beforeRender(),
});

if (Lambchop.isStatic()) {
  module.exports = Lambchop.staticGenerator(config);
}

exports.handler = app.run();
