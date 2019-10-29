import React from 'react';
import hotjarTrigger from 'lambchop/universal-rendering/analytics/hotjar';
import App from '../../app';

export default (req, res) => {
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
};
