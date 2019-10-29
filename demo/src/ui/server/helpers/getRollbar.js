import { RollbarNotifier } from 'lambchop/error-notification';

export default new RollbarNotifier({
  serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
  clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT
});
