import { uriComponentInDoubleQuotedAttr } from 'xss-filters';
import parseUtmParams from './parseUtmParams';
import getUrlParamsAsObject from './getUrlParamsAsObject';

const DEFAULT_CONSUMER = 'not-specified';
const DEFAULT_PAYLOAD = {
  consumer: DEFAULT_CONSUMER,
  params: {},
};

const generateTrackingPixelRequestUrl = (mainSiteUrl, payload = DEFAULT_PAYLOAD) => {
  const urlQueryParams = getUrlParamsAsObject();
  const utmParams = parseUtmParams(urlQueryParams, document.cookie);
  const { gclid, msclkid } = urlQueryParams;

  let url = `${mainSiteUrl}/track_click?request_referrer=${uriComponentInDoubleQuotedAttr(document.referrer || undefined)}`;
  Object.keys(utmParams).forEach((key) => {
    url += `&${uriComponentInDoubleQuotedAttr(key)}=${uriComponentInDoubleQuotedAttr(utmParams[key])}`;
  });

  if (gclid) {
    url += `&gclid=${uriComponentInDoubleQuotedAttr(gclid)}`;
  }
  if (msclkid) {
    url += `&msclkid=${uriComponentInDoubleQuotedAttr(msclkid)}`;
  }

  // Add the custom payload params
  const payloadParams = payload.params || {};
  url += `&consumer=${payload.consumer || DEFAULT_CONSUMER}`;
  Object.keys(payloadParams).forEach((key) => {
    url += `&${key}=${payloadParams[key]}`;
  });

  return url;
};

export default generateTrackingPixelRequestUrl;
