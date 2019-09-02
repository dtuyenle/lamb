/** @module ssr/templates/body */

import { gtmBody } from '../analytics/gtm';
import createSnippetFunctionAggregator from '../util/createSnippetFunctionAggregator';
import outputHtml from '../util/outputHtml';

/**
 * Render any third party script html right after body opening tag.
 * @param {String} gtmContainerId - Google Tag Manager container id.
 * @return {String or Array} Third party scripts html.
 */
const renderBodyThirdPartyScripts = ({
  gtmContainerId,
}) => gtmBody(gtmContainerId);

/**
 * Render app html inside body tag.
 * @param {String} appString - App html string.
 * @return {String} App html.
 */
const renderAppHtml = ({
  appString,
}) => `<div id="root">${appString}</div>`;

/**
 * Render custom html inside body tag.
 * @param {String or Array} bodySnippet - Body snippet html.
 * @return {String} Custom body html snippet.
 */
const renderBodyCustomSnippet = ({
  bodySnippet,
}) => (bodySnippet ? outputHtml(bodySnippet) : '');

/**
 * Create function aggregate multiple rendering functions.
 * @return {Function} Render body function.
 */
const renderBodyTags = createSnippetFunctionAggregator(
  renderBodyThirdPartyScripts,
  renderAppHtml,
  renderBodyCustomSnippet,
);

/**
 * Render body.
 * @param {Object} data - Data used to render body.
 * @return {String} Body html.
 */
const renderBody = data => `<body>${renderBodyTags(data)}</body>`;

export default renderBody;
