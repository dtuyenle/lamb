import RollbarNotifier from '../RollbarNotifier';

describe('RollbarNotifier', () => {
  it('should throw error if required options not set', () => {
    try {
      const rollbar = new RollbarNotifier();
    } catch(err) {
      expect(err.message).toEqual('You must provide serverAccessToken, clientAccessToken, environment');
    }
  });

  it('should create a rollbar instance', () => {
    const rollbar = new RollbarNotifier({
      serverAccessToken: '123',
      clientAccessToken: '123',
      environment: '123',
    });
    rollbar.sendErrorNotification('test', 2324);
    expect(rollbar.serverAccessToken).toEqual('123');
    expect(rollbar.clientAccessToken).toEqual('123');
    expect(rollbar.environment).toEqual('123');
    expect(rollbar.instance.constructor.name).toEqual('Rollbar');
  });
});
