import reactServerSideRender from '../../universal-rendering/reactServerSideRender';

/**
 * This function return html for react serverside render
 * It set status and attach into res object.
 * It also override title if passed in as param in case 404 or 500.
 * @param {Object} req - lamba-api req object
 * @param {Object} res - lamba-api res object
 * @param {Number} statusCode - HTTP status code
 * @param {String} title - Title to override
 * @param {Number} configData - Configuration data from lambchop class
 * @return {String} Page html.
 */
const getHtml = ({
  req, res, statusCode, title, configData,
}) => {
  const { appName, render, errorNotifier } = configData;
  let { assetMetaData = { assetBaseUrl: 'http://localhost:8080' } } = configData;
  assetMetaData = {
    ...assetMetaData,
    assetBaseUrl: assetMetaData.assetBaseUrl || 'http://localhost:8080',
  };

  // Set status code
  if (statusCode) {
    res.status(statusCode);
    res.statusCode = statusCode;
  }

  // Get data to render
  const {
    envForHydration, gaConfig = {}, pageMetaData,
    hashIdEndpoint = '/hshid', clientHydrationEndpoint,
    appRoot, headerSnippetPre = [], headerSnippet = [], bodySnippet = [],
  } = render(req, res);

  // Override title
  if (title) {
    pageMetaData.title = title;
  }

  const { data } = req;
  const { initialGTMDataLayer = {} } = gaConfig;

  let html = null;

  // Check if cached
  if (!req.cacheResponse) {
    html = reactServerSideRender({
      envForHydration,
      gaConfig: { ...gaConfig },
      errorNotifier,
      pageMetaData,
      assetMetaData: {
        filename: assetMetaData.filename || `${appName}Browser.js`,
        manifestDir: assetMetaData.manifestDir || `../public/${appName}/assets/manifest.json`,
        assetPath: assetMetaData.assetPath || `/${appName}/assets/`,
        assetBaseUrl: process.env.NODE_ENV !== 'development' ? '' : assetMetaData.assetBaseUrl,
      },
      initialGTMDataLayer,
      headerSnippetPre,
      headerSnippet,
      bodySnippet,
      initialStateData: clientHydrationEndpoint ? null : data,
      initialStateEndpoint: clientHydrationEndpoint || null,
      hashIdEndpoint,
      statusCode,
      appRoot,
    });
    req.uncachedHtml = html;
  } else {
    html = req.cacheResponse;
  }

  return html;
};

export default getHtml;
