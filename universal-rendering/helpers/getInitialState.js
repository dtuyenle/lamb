/** @module ssr/helpers/getInitialState */

/**
 * Get initial state and store as global object with variable name SSR_BRIDGE_DATA.
 * Throw error if no initialStateData or initialStateEndpoint
 * If initialStateData provided, It will stringify this state object and store as SSR_BRIDGE_DATA.
 * If initialStateEndpoint provided, It will use this endpoint to a ajax call.
 * The result will be store as SSR_BRIDGE_DATA.
 * @param {Object} initialStateData - Initial state data.
 * @param {String} initialStateEndpoint - Endpoint to get initial state data with ajax call.
 * To gain first byte performane we use this method.
 */
const getInitialState = ({
  initialStateName = 'SSR_BRIDGE_DATA',
  initialStateData,
  initialStateEndpoint,
}) => {
  if (!initialStateData && !initialStateEndpoint) {
    throw new Error('You must provide either initialStateData or initialStateEndpoint');
  }

  return initialStateData ? `
    <script>
      window['${initialStateName}'] = ${JSON.stringify(initialStateData)}
    </script>
    ` : `
    <!-- Fetch ${initialStateName} -->
    <script>(function() {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          var response = JSON.parse(xhr.responseText);
          window['${initialStateName}'] = response;
        } else {
          console.error('Failed to fetch ${initialStateName}');
        }
      }
      xhr.open('GET', '${initialStateEndpoint}');
      xhr.send();
    })();</script>
    <!-- End Fetch ${initialStateName} -->
    `;
};

export default getInitialState;
