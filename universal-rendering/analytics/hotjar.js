/** @module ssr/analytics/hotjar */

/**
 * Hotjar Javascript trigger.
 * @param {Function} customHotjarCode - Custom trigger for hot jar.
 */
const hotjarTrigger = (customHotjarCode = () => {}) => `
<!-- Hotjar JS triggers -->
<script type="text/javascript">
  window.hj=window.hj||function(){(hj.q=hj.q||[]).push(arguments)};
  ${customHotjarCode()}
</script>
<!-- End Hotjar JS triggers -->
`;

export default hotjarTrigger;
