import 'url-search-params-polyfill';

const paramsToObject = (entries) => {
  const result = {};
  for (let entry of entries) {
    const [key, value] = entry;
    result[key] = value;
  }

  return result;
};

const getUrlParamsAsObject = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return paramsToObject(urlParams.entries());
};

export default getUrlParamsAsObject;
