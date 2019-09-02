import AbstractCacheClient from '../AbstractCacheClient';

class TestCacheClientError extends AbstractCacheClient {}

class TestCacheClient extends AbstractCacheClient {
  constructor() { super(); }
  initialize() { this.instance = 'connected'; }
  connected() { return true; }
  get() { return 'data'; }
  set() { this.data = 'data'; }
}

describe('AbstractCacheClient', () => {
  it('should create a new instance', () => {
    const testCacheClient = new TestCacheClient();
    testCacheClient.set();
    expect(testCacheClient.connected()).toEqual(true);
    expect(testCacheClient.get()).toEqual('data');
    expect(testCacheClient.data).toEqual('data');
  });

  it('should throw error if required methods not implemented', () => {
    try {
      new TestCacheClientError();
    } catch(err) {
      expect(err.message).toEqual('TestCacheClientError must implement initialize,connected,get,set methods');
    }
  });

  it('should have initialize method get called when create an instance', () => {
    const testCacheClient = new TestCacheClient();
    expect(testCacheClient.instance).toEqual('connected');
  });

  it('should inject custom error', () => {
    const testCacheClient = new TestCacheClient();
    const mockFn = jest.fn();
    testCacheClient.injectCustomErrorHandler(mockFn);
    testCacheClient.handleError();
    expect(mockFn).toHaveBeenCalled();
  });
});
