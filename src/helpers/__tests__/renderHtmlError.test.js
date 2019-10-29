import renderHtmlError from '../renderHtmlError';
import configData from '../__mocks__/configData';


describe('getCacheClient', () => {
  it('should return 404 html page', async () => {
    const mockFn = jest.fn();
    const req = {}
    const res = {
      statusCode: 404,
      status: status => ({
        html: (html) => {
          expect(status).toEqual(404);
          return html;
        },
      }),
      header: (name, value) => `${name}${value}`,
    };

    const error = {
      response: {
        statusCode: 404,
      },
    }
    const html = renderHtmlError(configData)(error, req, res, mockFn);

    expect(mockFn).toHaveBeenCalled();
    expect(html).toContain('ERROR 404');
    expect(html).toContain('The page you were looking for doesn\'t exist (404).');
  });

  it('should return 500 html page', async () => {
    const mockFn = jest.fn();
    const req = {}
    const res = {
      statusCode: 500,
      status: status => ({
        html: (html) => {
          expect(status).toEqual(500);
          return html;
        },
      }),
      header: (name, value) => `${name}${value}`,
    };

    const error = {
      response: {
        statusCode: 500,
      },
    }
    const html = renderHtmlError(configData)(error, req, res, mockFn);

    expect(mockFn).toHaveBeenCalled();
    expect(html).toContain('ERROR 500');
    expect(html).toContain('We\'re experiencing an internal server problem (500).');
  });
});
