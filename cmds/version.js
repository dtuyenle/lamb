const { version } = require('../package.json');

module.exports = () => {
  console.info(`v${version}`);
};
