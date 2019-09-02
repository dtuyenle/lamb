import middlewares from '../header-preprocessor';
const { headerPreprocessor } = middlewares;

describe('headerPreprocessor', () => {
  it('should return a middleware and when run should set header data for both req and res', () => {
    const req = { headers: { nginx_geoip_country_code: 'US' }};
    const res = { header: jest.fn() };
    const next = jest.fn();
    const middleware = headerPreprocessor();
    middleware(req, res, next);

    expect(req.headers.countryCode).toEqual('US');
    expect(res.header).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
