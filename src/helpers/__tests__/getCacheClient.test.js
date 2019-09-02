import getCacheClient from '../getCacheClient';

describe('getCacheClient', () => {
  it('should return Redis client if cacheStoreName is Redis', async () => {
    const config = {
      cacheStoreName: 'Redis',
      host: '',
      password: '',
      port: ''
    };
    const client = getCacheClient(config);
    expect(client.constructor.name === 'RedisCacheClient').toEqual(true);
  });

  it('should return null if cacheStoreName is not defined', async () => {
    const config = {};
    const client = getCacheClient(config);
    expect(client).toEqual(null);
  });
});
