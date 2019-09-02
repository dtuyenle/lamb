/** @module middlewares/groups/error-handler */

/**
 * Log error using lambda-api logger and report it to rollbar.
 * @param {Function} errorNotifier - Error notifier function.
 * Expecting error and correlation id params.
 */
const errorNotification = errorNotifier => (error, req, res, next) => {
  req.log.error(error);
  errorNotifier(error, req.id);
  next();
};

/**
 * Send error status response.
 * This is the default one. Only send status in the response payload.
 */
const httpErrorResponse = () => (error, req, res, next) => {
  let status = 500;
  if (error.response) {
    const { statusCode } = error.response;
    status = statusCode || 500;
  }

  next();
  // Send something in the response ?
  return res.sendStatus(status);
};

export default {
  errorNotification,
  httpErrorResponse,
};
