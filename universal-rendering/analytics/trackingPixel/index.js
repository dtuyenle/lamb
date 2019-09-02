import generateTrackingPixelRequestUrl from './generateTrackingPixelRequestUrl';
import injectTrackingPixel from './injectTrackingPixel';

/**
 * This function injects the tracking pixel into the DOM.
 * This only gets executed browserside.
 * @param {Object} payload - Object that contains url params for the tracking pixel request
 * @param {String} payload.consumer - Let the tracking pixel know what app the request is coming from
 * @param {Object} payload.params - Params(in key, value pairs) to add to the tracking pixel request params
 */
const loadTrackingPixel = (payload) => {
  // Add the tracking pixel
  const mainSiteUrl = window.ENV_FROM_SERVER.MAIN_SITE_URL;
  const trackingPixelRequestUrl = generateTrackingPixelRequestUrl(mainSiteUrl, payload);
  // injectTrackingPixel function is from a partial called trackingPixel inside template.js
  injectTrackingPixel(trackingPixelRequestUrl);
};

export default loadTrackingPixel;
