import middlewares from '../error-handler';
const { errorNotification, httpErrorResponse } = middlewares;

const error = { response: { status: 500 } };
const req = { log: { error: jest.fn() }};
const res = { sendStatus: jest.fn() };
const next = jest.fn();
const errorNotifier = jest.fn();

describe('error-handler', () => {
  it('should log error when run errorNotification', async () => {
    const middleware = errorNotification(errorNotifier);
    await middleware(error, req, res, next);
    expect(next).toHaveBeenCalled();
    expect(errorNotifier).toHaveBeenCalled();
    expect(req.log.error).toHaveBeenCalled();
  });

  it('should send status code when run httpErrorResponse', async () => {
    const middleware = httpErrorResponse();
    await middleware(error, req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalled();
  });
});
