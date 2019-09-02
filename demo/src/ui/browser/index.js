import React from 'react';
import reactHydrator from '../../../../universal-rendering/reactHydrator';
import App from '../app';

const getAppRoot = () => {
  return (
    <App pageData={window.SSR_BRIDGE_DATA} location={location} history={history} />
  );
};

// format data for app
reactHydrator(getAppRoot);
