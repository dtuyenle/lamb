import React from 'react';
import App from '../app';
import Lambchop from '../../../../index';
import { RollbarNotifier } from '../../../../error-notification';
import hotjarTrigger from '../../../../universal-rendering/analytics/hotjar';

// Error Notifier
const Rollbar = new RollbarNotifier({
  serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
  clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT
});

// Data fetcher
const getData = async (req, res) => {
  const { pathParameters } = req;
  const { id } = pathParameters;
  const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({id, value: 'This is test data ' + id});
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

const app = Lambchop.app({
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
  errorNotifier: Rollbar,
  dataFetcher: getData,
  render: (req, res) => {
    const { statusCode } = res;
    const { data = {} } = req;
    const { value } = data;

    return {
      envForHydration: {
        WRITE_REVIEW_BASE_URL: process.env.WRITE_REVIEW_BASE_URL,
        MAIN_SITE_URL: process.env.MAIN_SITE_URL,
        IMAGE_BASE_URL: process.env.IMAGE_BASE_URL
      },
      gaConfig: {
        gaTrackingId: process.env.GA_TRACKING_ID,
        gaContainerId: process.env.OPTIMIZE_CONTAINER_ID,
        gtmContainerId: process.env.GTM_CONTAINER_ID,
        initialGTMDataLayer: value ? {
          value: value,
        } : {},
      },
      pageMetaData: {
        title: `Lambchop - ${new Date().getFullYear()}`,
        description: `This is demo app for lambchop.`,
      },
      hashIdEndpoint: `${process.env.MAIN_SITE_URL}/hshid`,
      appRoot: (<App pageData={data || {}} statusCode={statusCode} />),
      headerSnippet: value ? [
        hotjarTrigger(() => `
          if (${value}) {
            hj('trigger', 'upgraded_sp');
          }
        `),
      ] : [],
      bodySnippet: [],
    };
  },
});

app.injectMiddleware({
  hook: 'beforeRender',
  middleware: beforeRender(),
});

exports.handler = app.run();
