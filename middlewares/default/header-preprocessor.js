/** @module middlewares/groups/header-preprocessor */

/**
 * Preprocess header data logic.
 * Store the value into req object.
 * Add to the response header.
 */
/* eslint-disable camelcase */
const headerPreprocessor = () => (req, res, next) => {
  const { headers } = req;
  const { nginx_geoip_country_code } = headers;
  const countryCode = nginx_geoip_country_code || '--';
  req.headers.countryCode = countryCode;
  res.header('country-code', countryCode);
  next();
};

export default {
  headerPreprocessor,
};
