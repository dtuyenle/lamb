import AbstractNotifier from '../AbstractNotifier';

class TestAbstractNotifierError extends AbstractNotifier {}

class TestAbstractNotifier extends AbstractNotifier {
  constructor(options) {
    super(options);
    this.checkRequiredSettings(['test']);
  }

  sendErrorNotification() {}
}

describe('AbstractNotifier', () => {
  it('should throw error if required methods not implemented', () => {
    try {
      new TestAbstractNotifierError();
    } catch(err) {
      expect(err.message).toEqual('TestAbstractNotifierError must implement sendErrorNotification methods');
    }
  });

  it('should set options as class prop when create an instance', () => {
    const testNotifier = new TestAbstractNotifier({ test: 'test' });
    expect(testNotifier.test).toEqual('test');
  });

  it('should error out if required params not set', () => {
    try {
      const testNotifier = new TestAbstractNotifier();
    } catch (err) {
      expect(err.message).toEqual('You must provide test');
    }
  });
});
