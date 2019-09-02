import redis from 'redis';
import { promisify } from 'util';
import AbstractCacheClient from './AbstractCacheClient';
import promiseTimeout from '../../util/promiseTimeout';

/** Default value for Redis db data. When this expired data will be deleted. */
const DEFAULT_EXPIRE_TIME = 259200;

/**
 * Class representing Redis cache client.
 * @extends AbstractCacheClient
 */
class RedisCacheClient extends AbstractCacheClient {
  /**
   * Create redis client.
   * @param {String} host - The redis host address value.
   * @param {Number} port - The redis port value.
   * @param {String} password - The redis password value.
   * @param {String} ttl - Expire value in seconds.
   * When this expired the value will be deleted from Redis db.
   * @param {String} connectionTimeout - Connection time out.
   */
  constructor({
    host, port, password,
    ttl, connectionTimeout,
  }) {
    super();
    this.host = host;
    this.port = port;
    this.password = password;
    this.ttl = ttl;
    this.connectionTimeout = connectionTimeout || 100;
    this.initialize();
  }

  /**
   * Initialize cache client instance.
   */
  initialize() {
    let client = null;
    try {
      client = redis.createClient({
        host: this.host,
        port: this.port,
        password: this.password,
        retry_strategy: (options) => {
          console.warn('REDIS ERROR: Could not connect! Retrying ..................');
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        },
      });
      client.on('error', this.handleError);
    } catch (err) {
      this.handleError(err);
      console.error('REDIS ERROR: Could not createClient!!!');
    }
    this.instance = client;
  }

  /**
   * Check if redis instance connected.
   */
  connected() {
    return this.instance && this.instance.connected;
  }

  /**
   * Get data from Redis db based on key.
   * @param {String} key - Key value.
   * @param {Number} timeout - Timeout value.
   * Throw error if Redis db not responding, within this value in millisecond.
   * @return {Promise} A promise that get data from Redis db with timeout value.
   */
  async get(key, timeout) {
    const promisifiedGet = promisify(this.instance.get).bind(this.instance);
    return promiseTimeout(promisifiedGet(key), timeout || this.connectionTimeout)
      .catch((err) => {
        this.handleError(`redis.get failed, probably due to timeout, ${err}`);
        return false;
      });
  }

  /**
   * Store data into Redis db with key and value.
   * @param {String} key - Key to pair with value.
   * @param {String} value - Value to store.
   * @param {String} ttl - Expire value in seconds.
   * When this expired the value will be deleted from Redis db.
   */
  set(key, value, ttl) {
    try {
      this.instance.set(key, value, 'EX', ttl || this.ttl || DEFAULT_EXPIRE_TIME);
    } catch (err) {
      this.handleError(`Could not setCache on REDIS. ${err}`);
    }
  }
}

export default RedisCacheClient;
