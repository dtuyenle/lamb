/** @module ssr/helpers/getAssetUrl */

import fs from 'fs';
import path from 'path';

/**
 * Hotjar Javascript trigger.
 * @param {String} filename - File Name.
 * @param {String} manifestDir - Manifest dir.
 * @param {String} assetPath - Asset path.
 * @param {String} assetBaseUrl - Asset base url.
 */
const getAssetUrl = ({
  filename, manifestDir,
  assetPath, assetBaseUrl,
}) => {
  const manifestPath = path.resolve(__dirname, manifestDir);
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  const assetUrl = assetBaseUrl + assetPath + manifest[filename];
  return `<script src="${assetUrl}" defer="true" />`;
};

export default getAssetUrl;
