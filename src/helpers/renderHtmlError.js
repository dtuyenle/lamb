import getHtml from '../helpers/getHtml';
import continueUntilMatch from '../../util/continueUntilMatch';

/**
 * This function render error pages: 404, 500.
 * @param {Object} configData - configuration data passed in when users initialize Lambchop.
 * @param {Object} req - lamba-api req object.
 * @param {Object} res - lamba-api res object.
 * @param {Number} error - lamba-api error object.
 * @param {String} next - lambda-api next function to continue the execution stack.
 * @return {Middleware} Lambda api error middleware.
 */
const renderHtmlError = configData => (error, req, res, next) => {
  let status = 500;
  if (error.response) {
    const { statusCode } = error.response;
    status = statusCode || 500;
  }

  const title = continueUntilMatch()
    .on(() => status === 404, () => 'The page you were looking for doesn\'t exist (404).')
    .on(() => status === 500, () => 'We\'re experiencing an internal server problem (500).')
    .finally(() => '');

  const html = getHtml({
    req, res, statusCode: status, title, configData,
  });
  res.header('content-type', 'text/html');
  res.header('charset', 'utf-8');

  next();
  return res.status(status).html(html);
};

export default renderHtmlError;
