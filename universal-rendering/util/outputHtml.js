/**
 * Return concated html string
 * @param {String or Array} html - html string or array of html string
 * @return {String} html string.
 */
const outputHtml = html => (Array.isArray(html) ? html.join('\n') : html);

export default outputHtml;
