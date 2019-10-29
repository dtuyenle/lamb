import util from './util';
import LambChop from './src/LambChop';
import LambChopStatic from './src/LambChopStatic';
import LambChopStaticWorker from './src/LambChopStatic/LambChopStaticWorker';

const IS_STATIC_GENERATE = process.env && process.env.IS_STATIC_GENERATE;
const IS_STATIC_WORKER = process.env && process.env.IS_STATIC_WORKER;

export default {
  util,
  app: configData => (IS_STATIC_GENERATE ? new LambChopStatic(configData) : new LambChop(configData)),
  isStatic: () => IS_STATIC_WORKER,
  staticGenerator: LambChopStaticWorker,
};
