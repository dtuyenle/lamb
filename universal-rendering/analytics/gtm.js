/** @module ssr/analytics/gtm */

/**
 * Google Tag Manager data layer.
 * @param {Object} initialVariables - Google Tag Manager initial data layer.
 */
const gtmDataLayerInit = initialVariables => (initialVariables ? `
<script>
  dataLayer = [${JSON.stringify(initialVariables)}];
</script>
` : '');

/**
 * Google Tag Manager header section.
 * @param {String} containerId - Google Tag Manager container id.
 */
const gtmHead = containerId => (containerId ? `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->
` : '');

/**
 * Google Tag Manager body section.
 * @param {String} containerId - Google Tag Manager container id.
 */
const gtmBody = containerId => (containerId ? `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
` : '');

export { gtmDataLayerInit, gtmHead, gtmBody };
