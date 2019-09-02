import { RedisCacheClient } from '../../caching';
import continueUntilMatch from '../../util/continueUntilMatch';

/**
 * This function acts as a switch statement.
 * It returns cache client
 * @param {Object} config - configuration for cache client
 * @return {Object} Cache client instance.
 */
const getCacheClient = (config) => {
  const { cacheStoreName } = config;
  return continueUntilMatch()
    .on(cacheStoreName === 'Redis', new RedisCacheClient(config))
    .finally(null);
};

export default getCacheClient;
