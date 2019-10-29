import middlewares from '../retrieve-data';
const { retrieveData } = middlewares;

describe('retrieveData', () => {
  it('should fetch data and attach to req object as data prop', async () => {
    const promise = async(req, res) => {
      const fetchData = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({value: 'This is test data'});
        }, 300);
      });
      const data = await fetchData;
      return data;
    }
    const req = {};
    const res = { header: () => {} };
    const next = jest.fn();
    const middleware = retrieveData(promise);
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.data.value).toEqual('This is test data');
  });
});
