/**
  * Swicth replacement as declarative code.
  */


/**
  * Matched function used along with match function
  * @param {Any} result - result if matched.
  */
const matched = result => ({
  on: () => matched(result),
  finally: () => result,
});

/**
  * Abstraction that encapsulates the functionality of both switch and if-else if-else.
  * @param {Any} params - Params to be consumed by matched function. Optional.
  * Must call finally to get data return. This way we guarantee the default case always happen.
  */
const onFunc = params => (pred, fn) => (
  pred(params) ? matched(fn(params)) : match(params)
);
const onNonFunc = params => (cond, result) => (
  cond ? matched(result) : match(params)
);

const match = params => ({
  on: (pred, fn) => (
    typeof pred === 'function' ? onFunc(params)(pred, fn) : onNonFunc(params)(pred, fn)
  ),
  finally: fn => (typeof fn === 'function' ? fn(params) : fn),
});

export default match;
