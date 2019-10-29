import LambBase from './LambBase';
import middlewares from '../middlewares';

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
class LambChop extends LambBase {
  constructor(configData) {
    super(configData);
    this.loadCacheClient();
    this.loadHeaderPreprocessorMiddleware();
    this.loadDataFetcherMiddleware();
    this.loadCacheMiddleware();
    this.loadRenderMiddleware();
    this.loadErrorMiddlewares();
    this.loadMiddlewares();
  }

  loadDataFetcherMiddleware() {
    const { dataFetcher } = this.configData;
    if (dataFetcher) {
      this.loadMiddleware('dataFetcher', middlewares.retrieveData(dataFetcher));
    }
  }
}

export default LambChop;
