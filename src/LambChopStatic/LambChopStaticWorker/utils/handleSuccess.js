export default (id, callback) => {
  const successMsg = `Successfully processed ${id}!`;
  console.info(successMsg);
  return callback(null, successMsg);
};
