import LambdaAPI from 'lambda-api';
import getCacheClient from './helpers/getCacheClient';
import middlewares from '../middlewares';
import renderHtmlError from './helpers/renderHtmlError';
import renderHtmlPage from './helpers/renderHtmlPage';
import renderApiError from './helpers/renderApiError';

// Global variable storing aws lambda configuration
let functionName = '';

/**
 * This function return html for react serverside render
 * It set status and attach into res object.
 * It also override title if passed in as param in case 404 or 500.
 * @param {Object} req - lamba-api req object
 * @param {Object} res - lamba-api res object
 * @param {Number} statusCode - HTTP status code
 * @param {String} title - Title to override
 * @param {Number} configData - Configuration data from lambbase class
 */
class LambBase {
  constructor(configData) {
    this.configData = configData;
    this.lambdaAPI = LambdaAPI({
      logger: configData.logger || {
        access: true,
        stack: true,
        detail: true,
      },
    });
    this.cacheClient = null;
    this.middlewares = [];
  }

  loadMiddlewares() {
    const params = [];
    params.push('*');
    this.middlewares.forEach((middleware) => {
      params.push(middleware.middleware);
    });
    this.lambdaAPI.get.apply(this, params);
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
      const cacheWriteMiddleware = middlewares.cacheWrite(prefixKeyFunction, initHTMLCache, this.cacheClient);
      this.loadMiddleware('cacheRead', middlewares.cacheRead(prefixKeyFunction, this.cacheClient));
      // Set Cache when all middlewares done executions and response sent back
      this.lambdaAPI.finally(cacheWriteMiddleware);
    }
  }

  loadRenderMiddleware() {
    const { render, api } = this.configData;
    if (render) this.loadMiddleware('render', renderHtmlPage(this.configData));
    if (api) this.loadMiddleware('render', api);
  }

  loadErrorMiddlewares() {
    const { render, api, errorNotifier } = this.configData;
    const sendErrorNotification = errorNotifier ? errorNotifier.sendErrorNotification : () => {};
    this.lambdaAPI.use(middlewares.errorNotification(sendErrorNotification));
    if (render) this.lambdaAPI.use(renderHtmlError(this.configData));
    if (api) this.lambdaAPI.use(renderApiError());
  }

  injectMiddleware({ hook, middleware }) {
    this.middlewares.forEach(({ name }, index) => {
      if (name === 'render' && hook === 'beforeRender') {
        this.middlewares.splice(index, 0, { hook, middleware });
      }
    });
  }

  ejectMiddleware(hook) {
    this.middlewares = this.middlewares.filter(({ name }) => name !== hook);
  }

  run() { /* eslint-disable no-return-await */
    return async (event, context) => {
      // Assign functionName as global variable for prefixing cache key
      functionName = context.functionName.replace(/-/g, '_');

      return await this.lambdaAPI.run(event, context);
    };
  }
}

export default LambBase;
