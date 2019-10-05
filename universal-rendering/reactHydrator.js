import { hydrate } from 'react-dom';
import loadTrackingPixel from 'lambchop/universal-rendering/analytics/trackingPixel';

/**
 * This function polling to see if SSR_BRIDGE_DATA is available.
 * And use this data to render UI on client side.
 * @param {Function} getAppRoot - Function return React root component,
 * that will be used to render the app.
 * If using ajax polling for rendering data.
 * At this point we guarantee SSR_BRIDGE_DATA is available.
 * @param {Object} options - Options to turn on third party script
 * @param {String} options.hydrationContainerId - Container Id for react to hydrate
 * @param {Boolean} options.includeTrackingPixel -
 * If includeTrackingPixel is set It will load trackingPixel.
 * @param {Func} options.getTrackingPixelPayload() -
 * Function returns payload data to send to the tracking pixel service
 * @param {String} options.getTrackingPixelPayload().consumer -
 * Let the tracking pixel know what app the request is coming from
 * @param {Object} options.getTrackingPixelPayload().params -
 * Params(in key, value pairs) to add to the tracking pixel request params
 */
const reactHydrator = (getAppRoot, options = {}) => {
  const {
    hydrationContainerId = 'root',
    includeTrackingPixel = true,
    getTrackingPixelPayload = () => undefined,
  } = options;
  let interval;
  const renderer = () => {
    hydrate(
      getAppRoot(),
      document.getElementById(hydrationContainerId),
    );
    // Third party script
    if (includeTrackingPixel) { loadTrackingPixel(getTrackingPixelPayload()); }
  };

  /**
   * Function to be called by polling interval below.
   * Clears interval and initializes ui if state is ready.
  */
  const initializeIfStateReady = () => {
    if (window.SSR_BRIDGE_DATA !== undefined) {
      window.clearInterval(interval);
      renderer();
    }
  };

  if (window.SSR_BRIDGE_DATA) {
    // Initialize ui if state from server is ready by the time this file executes.
    renderer();
  } else {
    // Otherwise, check for state every 10 milliseconds
    interval = window.setInterval(initializeIfStateReady, 10);
  }
};

export default reactHydrator;
