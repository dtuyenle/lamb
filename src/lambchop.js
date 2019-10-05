import LambdaAPI from 'lambda-api';
import getCacheClient from './helpers/getCacheClient';
import getHtml from './helpers/getHtml';
import middlewares from '../middlewares';
import continueUntilMatch from '../util/continueUntilMatch';

// Global variable storing aws lambda configuration
let functionName = '';

/**
 * This function render error pages: 404, 500.
 * @param {Object} configData - configuration data passed in when users initialize Lambchop.
 * @param {Object} req - lamba-api req object.
 * @param {Object} res - lamba-api res object.
 * @param {Number} error - lamba-api error object.
 * @param {String} next - lambda-api next function to continue the execution stack.
 * @return {Middleware} Lambda api error middleware.
 */
const renderHtmlError = configData => (error, req, res, next) => {
  let status = 500;
  if (error.response) {
    const { statusCode } = error.response;
    status = statusCode || 500;
  }

  const title = continueUntilMatch()
    .on(() => status === 404, () => 'The page you were looking for doesn\'t exist (404).')
    .on(() => status === 500, () => 'We\'re experiencing an internal server problem (500).')
    .finally(() => '');

  const html = getHtml({
    req, res, statusCode: status, title, configData,
  });
  res.header('content-type', 'text/html');
  res.header('charset', 'utf-8');

  next();
  return res.status(status).html(html);
};

/**
 * This function render page.
 * @param {Object} configData - configuration data passed in when users initialize Lambchop.
 * @param {Object} req - lamba-api req object.
 * @param {Object} res - lamba-api res object.
 * @return {Middleware} Lambda api middleware.
 */
const renderPage = configData => (req, res) => {
  const html = getHtml({ req, res, configData });
  res.header('content-type', 'text/html');
  res.header('charset', 'utf-8');
  return res.status(200).html(html);
};

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
class Lambchop {
  constructor(configData) {
    this.configData = configData;
    this.lambdaAPI = LambdaAPI({
      logger: {
        access: true,
        stack: true,
        detail: true,
      },
    });
    this.cacheClient = null;
    this.middlewares = [];

    this.loadCacheClient();
    this.loadHeaderPreprocessorMiddleware();
    this.loadDataFetcherMiddleware();
    this.loadCacheMiddleware();
    this.loadRenderMiddleware();
    this.loadErrorMiddlewares();
  }

  loadMiddleware(name, middleware) {
    this.middlewares.push({ name, middleware });
  }

  loadCacheClient() {
    const { cache } = this.configData;
    if (cache) {
      this.cacheClient = getCacheClient(cache);
    }
  }

  loadHeaderPreprocessorMiddleware() {
    const { headerPreprocessor } = this.configData;
    this.loadMiddleware('headerPreprocessor', headerPreprocessor || middlewares.headerPreprocessor());
  }

  loadDataFetcherMiddleware() {
    const { dataFetcher } = this.configData;
    this.loadMiddleware('dataFetcher', middlewares.retrieveData(dataFetcher));
  }

  loadCacheMiddleware() {
    const { appName, cache } = this.configData;
    if (cache) {
      const { keyFunction } = cache;
      const prefixKeyFunction = (req, res) => {
        if (!req.cacheKey) {
          req.cacheKey = `${functionName}_${appName}_${keyFunction(req, res)}`;
        }
        return req.cacheKey;
      };
      const initHTMLCache = req => req.uncachedHtml || null;
      this.loadMiddleware('cacheRead', middlewares.cacheRead(prefixKeyFunction, this.cacheClient));
      // Set Cache when all middlewares done executions and response sent back
      this.lambdaAPI.finally(
        middlewares.cacheWrite(prefixKeyFunction, initHTMLCache, this.cacheClient),
      );
    }
  }

  loadRenderMiddleware() {
    this.loadMiddleware('renderPage', renderPage(this.configData));
  }

  loadErrorMiddlewares() {
    const { errorNotifier } = this.configData;
    this.lambdaAPI.use(middlewares.errorNotification(
      errorNotifier ? errorNotifier.sendErrorNotification : () => {},
    ));
    this.lambdaAPI.use(renderHtmlError(this.configData));
  }

  injectMiddleware({ hook, middleware }) {
    this.middlewares.forEach(({ name }, index) => {
      if (name === 'renderPage' && hook === 'beforeRender') {
        this.middlewares.splice(index, 0, { hook, middleware });
      }
    });
  }

  run() { /* eslint-disable no-return-await */
    const params = [];
    params.push('*');
    this.middlewares.forEach((middleware) => {
      params.push(middleware.middleware);
    });
    this.lambdaAPI.get.apply(this, params);
    return async (event, context) => {
      // Assign functionName as global variable for prefixing cache key
      functionName = context.functionName.replace(/-/g, '_');

      return await this.lambdaAPI.run(event, context);
    };
  }
}

export default Lambchop;
