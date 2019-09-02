/** @module ssr/helpers/loadServerEnv */

/**
 * Store environment variable from lambda as global object ENV_FROM_SERVER.
 * Be careful to cherry pick what can be exposed.
 * @param {Object} envFromServer - Environment variable object.
 */
const loadServerEnv = envFromServer => (envFromServer ? `
  <!-- initialize env on window -->
  <script>
    window.ENV_FROM_SERVER = ${JSON.stringify(envFromServer)};
  </script>
  <!-- end initialize env on window -->
` : '');

export default loadServerEnv;
