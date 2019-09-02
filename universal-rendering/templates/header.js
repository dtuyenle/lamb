/** @module ssr/templates/header */

import { gtmDataLayerInit, gtmHead } from '../analytics/gtm';
import gaOptimizeSnippet from '../analytics/ga';
import loadServerEnv from '../helpers/loadServerEnv';
import getInitialState from '../helpers/getInitialState';
import getAssetUrl from '../helpers/getAssetUrl';
import pushHshId from '../helpers/pushHshId';
import outputHtml from '../util/outputHtml';
import createSnippetFunctionAggregator from '../util/createSnippetFunctionAggregator';

/**
 * Render meta tags.
 * @param {Object} pageMetaData - Key value pair meta tags data.
 * @return {Array} Array of meta tags html.
 */
const renderHeaderMetaData = ({
  pageMetaData,
}) => Object.keys(pageMetaData).map(metaDataKey => `<meta name="${metaDataKey}" content="${pageMetaData[metaDataKey]}" />`);

/**
 * Render asset tag.
 * @param {Object} assetMetaData - Asset meta data object.
 * @return {String} Script tag html.
 */
const renderAssetsUrl = ({
  assetMetaData,
}) => getAssetUrl(assetMetaData);

/**
 * Render third party scripts tag.
 * @param {Object} errorNotifier - Error notifier.
 * @param {Object} gaConfig - Google analytic config object.
 * @param {Object} initialGTMDataLayer - Initial Google Tag Manager data layer .
 * @return {Array} Array of third party script tags html.
 */
const renderHeaderThirdPartyScripts = ({
  errorNotifier, gaConfig = {}, initialGTMDataLayer,
}) => {
  const { gaTrackingId, gaContainerId, gtmContainerId } = gaConfig;
  return [
    errorNotifier ? errorNotifier.getBrowserScriptTag() : '',
    gaOptimizeSnippet(gaTrackingId, gaContainerId),
    gtmDataLayerInit(initialGTMDataLayer),
    gtmHead(gtmContainerId),
  ];
};

/**
 * Render custom snippet for header tag.
 * @param {Object} envForHydration - Environment object.
 * @param {String} headerSnippet - Header html snippet.
 * @param {Object} initialStateData - Initial state data.
 * @param {String} initialStateEndpoint - Initial state endpoint.
 * @return {Array} Array of header custom html snippet.
 */
const renderHeaderCustomSnippet = ({
  hashIdEndpoint, headerSnippet, initialStateData, initialStateEndpoint, statusCode = 200,
}) => [
  headerSnippet ? outputHtml(headerSnippet) : '',
  statusCode === 200 ? getInitialState({ initialStateEndpoint, initialStateData }) : '',
  pushHshId(hashIdEndpoint),
];

/**
 * Render styles tag.
 * @param {String or Array} styles - Style snippets.
 * @return {String or Array} Style html.
 */
const renderStyles = ({
  styles,
}) => styles;

/**
 * Create function aggregate multiple rendering functions.
 * @return {Function} Render header function.
 */
const renderHeaderTags = createSnippetFunctionAggregator(
  renderHeaderMetaData,
  renderAssetsUrl,
  renderHeaderThirdPartyScripts,
  renderHeaderCustomSnippet,
  renderStyles,
);

/**
 * Render header.
 * @param {Object} data - Data used to render header.
 * @return {String} Header html.
 */
const renderHeader = (data) => {
  const { pageMetaData, envForHydration } = data;
  const { title } = pageMetaData;
  return `
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>${title}</title>
      ${loadServerEnv(envForHydration)}
      ${renderHeaderTags(data)}
    </head>
  `;
};

export default renderHeader;
