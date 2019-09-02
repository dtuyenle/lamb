/** @module middlewares/groups/caching */

/**
 * Read cache data and append the result into req payload as cacheResponse prop if available.
 * @param {Function} getKey - Return key to get data from redis.
 * @param {Object} client - Cache client instance.
 */
const cacheRead = (getKey, client) => async (req, res, next) => {
  client.injectCustomErrorHandler(req.log.warn);
  const start = new Date();

  // Check if cached
  if (client.connected()) {
    const key = getKey(req, res);
    const body = await client.get(key);
    if (body) {
      req.cacheResponse = body;
      req.log.info(`Found cached key: ${key}.`);
    } else {
      req.log.info(`Could not find data with key: ${key}.`);
    }
  } else {
    req.log.error(`Could not connect with ${client.constructor.name}.`);
  }

  const end = new Date();
  res.header('time-taken-cache', end.getTime() - start.getTime());
  next();
};

/**
 * Store data into Redis db.
 * @param {Function} getKey - Return key to get data from redis.
 * @param {Function} getUncachedHtml - Return data to store into redis.
 * @param {Object} client - Cache client instance.
 */
const cacheWrite = (getKey, getUncachedHtml, client) => async (req, res) => {
  const { statusCode = 200 } = res;
  client.injectCustomErrorHandler(req.log.warn);
  if (statusCode === 200) {
    const cacheKey = getKey(req, res);
    const uncachedHtml = getUncachedHtml(req, res);
    if (uncachedHtml) {
      client.set(cacheKey, uncachedHtml);
    } else {
      req.log.info(`There are no cache data ${uncachedHtml} for key: ${cacheKey}.`);
    }
  }
};

export default {
  cacheRead, cacheWrite,
};
