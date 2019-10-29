const { exec } = require('child_process');
const yargs = require('yargs');

const getProcessInvokeCmd = (args) => {
  // arguments
  const parsedArgs = yargs(args).argv;

  return `
    NODE_ENV=${parsedArgs.env} &&
    serverless invoke local --function ${parsedArgs.func} --data '{"path": "/", "httpMethod": "GET"}' -e IS_STATIC_GENERATE=true --stage ${parsedArgs.stage}
  `;
};

module.exports = (args) => {
  console.info('*** Starting  generating static. This could take couple minutes. ***');

  /**
   * Example: NODE_ENV=development &&
   * serverless invoke local --function uiServer
   * -e IS_STATIC=true --data '{ "path": "/", "httpMethod": "GET" }'
   * --stage dev
   */
  const serverlessInvokeProcess = exec(getProcessInvokeCmd(args));

  serverlessInvokeProcess.on('error', (err) => {
    console.error(`
      ------------------------------------------------------------
      Something happened
    `);
    console.error(err, true);
  });

  serverlessInvokeProcess.stdout.on('data', (data) => {
    console.info(data.toString());
  });

  serverlessInvokeProcess.stderr.on('data', (err) => {
    console.error(`\nERROR:\n ${err}`);
  });

  serverlessInvokeProcess.on('exit', (data) => {
    console.info('Finished generating static files.');
    console.info(data);
  });

  process.on('exit', () => {
    if (serverlessInvokeProcess.pid) {
      console.info(`Static Generator bundler PID: ${serverlessInvokeProcess.pid}`);
      serverlessInvokeProcess.kill();
    }
  });

  process.on('SIGINT', () => {
    console.info('\nGracefully shutting down static file generator from SIGINT (Ctrl+C)');
    process.exit();
  });

  process.on('SIGTERM', () => {
    console.info('\nGracefully shutting down static file generator from SIGTERM');
    process.exit();
  });
};
