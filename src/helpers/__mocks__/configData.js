import React from 'react';
import { RollbarNotifier } from '../../../error-notification';

// Error Notifier
const Rollbar = new RollbarNotifier({
  serverAccessToken: '1234',
  clientAccessToken: '1234',
  environment: 'test',
});

const mock = {
  envForHydration : {
    env: 'test',
  },
  gaConfig: {
    gaTrackingId: 'ga_12345',
    gaContainerId: 'ga_12345',
    gtmContainerId: 'gtm_12345',
  },
  errorNotifier: Rollbar,
  pageMetaData: {
    title: `Lambchop - ${new Date().getFullYear()}`,
    description: `This is demo app for lambchop.`,
  },
  assetMetaData: {
    filename: `testBrowser.js`,
    manifestDir: `../__mocks__/manifest.json`,
    assetPath: `/test/assets/`,
    assetBaseUrl: 'http://localhost:8080',
  },
  initialGTMDataLayer: {
    data_layer: 'test'
  },
  headerSnippet: ['<style src=""custom_header" />'],
  bodySnippet: ['<style src=""custom_body" />'],
  initialStateData: {
    value: 'test',
  },
  initialStateEndpoint: null,
  appRoot: <p>This is test!</p>,
  render: (req, res) => {
    const { statusCode } = res;

    return {
      envForHydration: {},
      gaConfig: {},
      pageMetaData: {},
      hashIdEndpoint: 'hashId',
      clientHydrationEndpoint: 'hydration',
      appRoot: <div>
        {statusCode === 500 && <p>ERROR 500</p>}
        {statusCode === 404 && <p>ERROR 404</p>}
        {statusCode === 200 && <p>Page 200</p>}
      </div>,
      headerSnippet: [],
      bodySnippet: [],
    }
  }
}

export default mock;
