import reactHydrator from '../reactHydrator';

describe('reactHydrator', () => {
  it('should execute hydration when SSR_BRIDGE_DATA available', () => {
    const mockFn = jest.fn();
    global.window.SSR_BRIDGE_DATA = {};

    try {
      reactHydrator(mockFn);
      expect(mockFn).toHaveBeenCalled();
    } catch(err) {
      expect(err.message).toEqual('Target container is not a DOM element.');
    }
  });
});
