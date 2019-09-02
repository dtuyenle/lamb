import outputHtml from './outputHtml';

/**
 * Generate a function that combine multiple functions.
 * Data passed to generated function will be available automatically for all combined functions.
 * Results from each combined functions will be concat to the final result.
 * @param {Array} fns - array of functions
 * @return {Function} Generated function combining multiple functions.
 */
const createSnippetFunctionAggregator = (...fns) => data => fns.reduce(
  (accumulator, fn) => accumulator + outputHtml(fn(data)),
  '',
);

export default createSnippetFunctionAggregator;
