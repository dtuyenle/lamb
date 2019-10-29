import WorkerFarm from 'worker-farm';
import Promise from 'bluebird';
import LambBase from '../LambBase';
import createFolders from './utils/createFolders';
import logSuccess from './utils/logSuccess';
import logResult from './utils/logResult';
import logError from './utils/logError';

const START_TIME = new Date();
const FOLDER_NAME = START_TIME.toJSON();

const DEFAULT_WORKER_CONFIG = {
  workerOptions: {
    env: {
      IS_STATIC_WORKER: true,
      ...process.env,
    },
  },
  autoStart: true,
  maxRetries: 5,
  maxCallTime: 30000,
  maxConcurrentCalls: 1000,
  maxConcurrentCallsPerWorker: 10,
};

/**
 * This function return html for react serverside render
 * It set status and attach into res object.
 * It also override title if passed in as param in case 404 or 500.
 * @param {Object} req - lamba-api req object
 * @param {Object} res - lamba-api res object
 * @param {Number} statusCode - HTTP status code
 * @param {String} title - Title to override
 * @param {Number} configData - Configuration data from LambChopStatic class
 * @return {String} Page html.
 */
class LambChopStatic extends LambBase {
  constructor(configData) {
    super(configData);
    this.workers = [];
    this.workersAsync = [];
  }

  loadWorkers(workerConfig, childPath) {
    this.workers = WorkerFarm(workerConfig || DEFAULT_WORKER_CONFIG, childPath);
    this.workersAsync = Promise.promisify(this.workers);
  }

  handleSuccess(folderPath, logFolderPath) {
    logSuccess(folderPath);
    logResult(START_TIME, logFolderPath);
    WorkerFarm.end(this.workers);
  }

  handleError(logFolderPath, error) {
    logError(logFolderPath, error);
    WorkerFarm.end(this.workers);
  }

  run() { /* eslint-disable no-return-await */
    return async (event, context) => {
      const { configData } = this;
      const { staticConfig } = configData;
      const { workerConfig, childPath, dataGenerator } = staticConfig;
      let { folderPath, logFolderPath } = staticConfig;

      // Create file folder and log folder
      createFolders(folderPath, logFolderPath, FOLDER_NAME);

      // Folder path with date time indicator
      folderPath = `${folderPath}/${FOLDER_NAME}`;
      logFolderPath = `${logFolderPath}/${FOLDER_NAME}`;

      // Prepare data
      const staticData = await dataGenerator();
      const staticPromiseData = staticData.map(staticDataItem => ({
        event,
        context,
        staticDataItem,
        folderPath,
        logFolderPath,
      }));

      // Load worker
      this.loadWorkers(workerConfig, childPath);

      // Run
      try {
        await Promise.map(staticPromiseData, this.workersAsync);
        this.handleSuccess(folderPath, logFolderPath);
      } catch (error) {
        setTimeout(() => this.handleError(logFolderPath, error), 500);
      }
    };
  }
}

export default LambChopStatic;
