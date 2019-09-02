/** Abstract Class representing cache.
  * Can be used to extend other cache client class.
  */
class AbstractCacheClient {
  /**
   * Create cache abstract class.
   * Must implement 'initialize', 'connected', 'get', 'set' methods.
   * Check required methods, throw exception if not found.
   * Initialize cache client instance.
   */
  constructor() {
    const requiredMethods = [
      'initialize', 'connected', 'get', 'set',
    ];
    const errors = [];
    requiredMethods.forEach((method) => {
      if (!Reflect.has(this, method)) {
        errors.push(method);
      }
    });
    if (errors.length > 0) {
      throw new Error(`${this.constructor.name} must implement ${errors.join(',')} methods`);
    }

    this.instance = null;
  }

  /**
   * Default error handler.
   */
  /* eslint-disable class-methods-use-this */
  handleError(error) {
    console.error(error);
  }

  /**
   * Inject custom error handler for cache client.
   * Override the default one.
   * @param {Function} errorHandler - Custom error handler function.
   */
  injectCustomErrorHandler(errorHandler) {
    this.handleError = (error) => {
      errorHandler(error);
    };
  }
}

export default AbstractCacheClient;
