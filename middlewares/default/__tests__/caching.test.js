import middlewares from '../caching';
const { cacheRead, cacheWrite } = middlewares;

const cacheData = {value: 'This is test data'};
const getKey = () => 'key';
const getUncachedHtml = () => 'html';
const client = {
  injectCustomErrorHandler: jest.fn(),
  connected: () => true,
  get: async(key) => {
    const fetchData = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(cacheData);
      }, 300);
    });
    const data = await fetchData;
    return data;
  },
  set: jest.fn(),
};

const req = { log: { info: console.log, warn: console.warn, error: jest.fn() } };
const res = { header: () => {}, statusCode: 200 };
const next = jest.fn();

describe('caching', () => {
  it('should get cache data and attach to req as cacheResponse', async () => {
    const middleware = cacheRead(getKey, client);
    await middleware(req, res, next);
    expect(client.injectCustomErrorHandler).toHaveBeenCalled();
    expect(req.cacheResponse).toEqual(cacheData);
    expect(next).toHaveBeenCalled();
  });

  it('should log error out if cant connect', async () => {
    client.connected = () => false;
    const middleware = cacheRead(getKey, client);
    await middleware(req, res, next);
    expect(req.log.error).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should execute write cache if response status code is 200', async () => {
    const middleware = cacheWrite(getKey, getUncachedHtml, client);
    await middleware(req, res);
    expect(client.set).toHaveBeenCalled();
  });

  it('should not execute write cache if response status code is not 200', async () => {
    res.statusCode = 404;
    const middleware = cacheWrite(getKey, getUncachedHtml, client);
    await middleware(req, res);
    expect(client.set).not.toHaveBeenCalled();
  });
});
