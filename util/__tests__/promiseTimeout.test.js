import promiseTimeout from '../promiseTimeout';

describe('promiseTimeout', () => {
  it('should timeout in 1000ms', async () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('done');
      }, 2000);
    });

    await expect(
      promiseTimeout(promise, 1000)
    ).rejects.toThrow('Promise timed out in 1000 ms');
  });

  it('should resolve in 1000ms', async () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('done');
      }, 1000);
    });

    await expect(
      promiseTimeout(promise, 2000)
    ).resolves.toEqual('done');
  });
});