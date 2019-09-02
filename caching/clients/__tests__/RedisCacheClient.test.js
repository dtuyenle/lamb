import RedisCacheClient from '../RedisCacheClient';

describe('RedisCacheClient', () => {
  it('should create a new instance', () => {
    const redisCacheClient = new RedisCacheClient({
      host: '127.0.0.1', port: '443', password: '',
    });
    expect(redisCacheClient.instance !== null).toEqual(true);
  });

  it('should timeout after 1ms if connection not established when do a get data', async () => {
    const redisCacheClient = new RedisCacheClient({
      host: '127.1.1.1', port: '443', password: '', connectionTimeout: 1,
    });
    redisCacheClient.injectCustomErrorHandler((error) => {
      expect(error).toEqual('redis.get failed, probably due to timeout, Error: Promise timed out in 1 ms');
    });
    const data = await redisCacheClient.get('test');
    expect(data).toEqual(false);
  });
});
