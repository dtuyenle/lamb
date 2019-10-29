/**
 * This function render error api: 404, 500.
 * @param {Object} req - lamba-api req object.
 * @param {Object} res - lamba-api res object.
 * @param {Number} error - lamba-api error object.
 * @param {String} next - lambda-api next function to continue the execution stack.
 * @return {Middleware} Lambda api error middleware.
 */
const renderApiError = () => (error, req, res, next) => {
  let status = 500;
  if (error.response) {
    const { statusCode } = error.response;
    status = statusCode || 500;
  }
  next();
  return res.status(status).json({});
};

export default renderApiError;
