/**
  * Create a promise that times out a given promise  based on a given time limit (in milliseconds)
  * @param {Promise} promise - promise to be timed out.
  * @param {Number} timeLimit - time limit for timeout in milliseconds.
  */
function promiseTimeout(promise, timeLimit) {
  let timeoutId;
  const timeoutRacer = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      return reject(new Error(`Promise timed out in ${timeLimit} ms`));
    }, timeLimit);
  });

  return Promise.race([
    promise,
    timeoutRacer,
  ]).then((result) => {
    clearTimeout(timeoutId);
    return Promise.resolve(result);
  });
}

export default promiseTimeout;
