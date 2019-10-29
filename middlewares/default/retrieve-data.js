/** @module middlewares/groups/retrieve-data */

/**
 * Must be used once only. By default the result will be added into request payload as data prop.
 * @param {Function} promise - Use this promise to get data from third party endpoints.
 */
const retrieveData = promise => async (req, res, next) => {
  const start = new Date();
  const data = await promise(req, res);
  req.data = data;
  const end = new Date();
  res.header('time-taken-fetch-data', end.getTime() - start.getTime());
  next();
};

export default { retrieveData };
