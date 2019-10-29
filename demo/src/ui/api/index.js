import Lambchop from '../../../../index';
import { RollbarNotifier } from 'lambchop/error-notification';

// Error Notifier
const Rollbar = new RollbarNotifier({
  serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
  clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT
});

// Data fetcher
const api = async (req, res) => {
  const { pathParameters } = req;
  const { id } = pathParameters;
  const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, value: 'This is test data ' + id });
    }, 300);
  });

  // Throwing error
  // let error = new Error();
  // error.response = { statusCode: 404 };
  // return Promise.reject(error);
  const data = await fetchData;
  return res.status(200).json(data);
};

const app = Lambchop.app({
  appName: 'lambchop-api',
  errorNotifier: Rollbar,
  api: api,
});

exports.handler = app.run();
