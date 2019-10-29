import LambBase from '../../../LambBase';

export default (configData, data) => {
  const htmlGenerator = new LambBase(configData);
  htmlGenerator.loadHeaderPreprocessorMiddleware();
  htmlGenerator.loadMiddleware('dataFetcher', (req, res, next) => {
    req.data = data;
    return next();
  });
  htmlGenerator.loadRenderMiddleware();
  htmlGenerator.loadErrorMiddlewares();
  htmlGenerator.loadMiddlewares();

  return htmlGenerator;
};
