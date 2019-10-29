import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';
import renderHeader from './templates/header';
import renderBody from './templates/body';

/**
 * Render server side html.
 * @param {Object} data - Data used to render html.
 * @return {String} Page html.
 */
const reactServerSideRender = (data) => { /* eslint-disable no-unused-vars */
  const {
    /**
     * Lambda enviroment object (key/value). Be careful not expose sensitive data.
     * @todo look at pulling these into the API return payload.
     * Look at dependencies to make sure none of our core app functionality,
     * depends on stuff that pushing through env from server
     */
    envForHydration,
    /**
     * Google analytic setting object.
     * @param {String} gaTrackingId - Google Analytic tracking id.
     * @param {String} gaContainerId - Google Analytic container id.
     * @param {String} gtmContainerId - Google Tag Manager container id.
     */
    gaConfig,
    /**
     * Error notifier object.
     */
    errorNotifier,
    /**
     * Meta data to render meta tags. Key is name attr and value is content attr.
     */
    pageMetaData,
    /**
     * Asset meta data to generate asset url
     * @todo webpack research
     * @param {String} filename - File Name.
     * @param {String} manifestDir - Manifest dir.
     * @param {String} assetPath - Asset path.
     * @param {String} assetBaseUrl - Asset base url.
     */
    assetMetaData,
    /**
     * Initial Google Tag Manager data layer.
     */
    initialGTMDataLayer,
    /**
     * Custom header snippets BEFORE the app js.
     */
    headerSnippetPre,
    /**
     * Custom header snippets.
     */
    headerSnippet,
    /**
     * Custom body snippets.
     */
    bodySnippet,
    /**
     * Initial state data to render on client side.
     */
    initialStateData,
    /**
     * Endpoint to get initial state data.
     */
    initialStateEndpoint,
    /**
     * React root element.
     */
    appRoot,
  } = data;
  const scSheet = new ServerStyleSheet();
  const appString = renderToString(scSheet.collectStyles(appRoot));
  const styles = scSheet.getStyleTags();
  const renderingData = Object.assign({
    appString, styles,
  }, data);

  return `
    <!DOCTYPE html>
    <html>
      ${renderHeader(renderingData)}
      ${renderBody(renderingData)}
    </html>
  `;
};

export default reactServerSideRender;
