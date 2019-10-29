export default (id, callback) => {
  const errMsg = `There was an error processing ${id}! Please check log.`;
  console.error(errMsg);
  return callback(errMsg, null);
};
