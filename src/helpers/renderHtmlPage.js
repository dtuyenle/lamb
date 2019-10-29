import getHtml from '../helpers/getHtml';

/**
 * This function render page.
 * @param {Object} configData - configuration data passed in when users initialize Lambchop.
 * @param {Object} req - lamba-api req object.
 * @param {Object} res - lamba-api res object.
 * @return {Middleware} Lambda api middleware.
 */
const renderHtmlPage = configData => (req, res) => {
  const html = getHtml({ req, res, configData });
  res.header('content-type', 'text/html');
  res.header('charset', 'utf-8');
  return res.status(200).html(html);
};

export default renderHtmlPage;
