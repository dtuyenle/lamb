const utmQueryParams = (query) => {
  const utm = {};
  Object.keys(query).forEach((key) => {
    if (key.match(/utm/)) {
      utm[key] = query[key];
    }
  });
  return utm;
};

// This function will get the UTM params from the cookie if they exist in the cookie
// If the UTM params exist in the URL query params those will be used
const parseUtmParams = (query, cookie) => {
  let utmParams = {};
  const utmMatch = decodeURIComponent(cookie).match(/{("|')utm.+}/);
  if (utmMatch) {
    utmParams = JSON.parse(utmMatch[0]) || {};
  }
  if (query) {
    const queryParamsWithUtm = utmQueryParams(query);
    if (Object.keys(queryParamsWithUtm).length > 0) {
      utmParams = queryParamsWithUtm;
    }
  }
  return utmParams;
};

export default parseUtmParams;
