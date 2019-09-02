/** @module ssr/helpers/pushHshId */

/**
 * Fetch and dataLayer.push hshID.
 * @param {String} hshIdEndpoint - Hash id endpoint
 */
const pushHshId = hshIdEndpoint => `
  <!-- Fetch and dataLayer.push hshID -->
  <script>(function() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = JSON.parse(xhr.responseText);
        dataLayer.push(response);
      } else {
        console.error('Failed to fetch hshID');
      }
    }
    xhr.open('GET', '${hshIdEndpoint}');
    xhr.send();
  })();</script>
  <!-- End Fetch hshID -->
`;

export default pushHshId;
