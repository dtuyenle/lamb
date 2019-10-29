import logError from './utils/logError';
import logSuccess from './utils/logSuccess';
import handleSuccess from './utils/handleSuccess';
import handleError from './utils/handleError';
import getHtmlGenerator from './utils/getHtmlGenerator';
import createStaticFile from './utils/createStaticFile';

export default configData => async (data, index, total, callback) => {
  const {
    event,
    context,
    staticDataItem,
    folderPath,
    logFolderPath,
  } = data;
  const { id } = staticDataItem;
  try {
    const htmlGenerator = getHtmlGenerator(configData, staticDataItem);
    await createStaticFile({
      event,
      context,
      callback,
      folderPath,
      logFolderPath,
      staticDataItem,
      htmlGenerator,
    });
    logSuccess(id, logFolderPath);
    return handleSuccess(id, callback);
  } catch (error) {
    logError(staticDataItem, error, logFolderPath);
    return handleError(id, callback);
  }
};
