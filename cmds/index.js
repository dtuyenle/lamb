const versionCmd = require('./version');
const helpCmd = require('./help');
const staticCmd = require('./static');

module.exports = () => {
  const [,, ...args] = process.argv;
  const cmd = args[0] || 'help';

  switch (cmd) {
    case 'version':
      versionCmd(args);
      break;

    case 'help':
      helpCmd(args);
      break;

    case 'static':
      staticCmd(args);
      break;

    default:
      console.error(`"${cmd}" is not a valid command!`);
      process.exit();
      break;
  }
};
