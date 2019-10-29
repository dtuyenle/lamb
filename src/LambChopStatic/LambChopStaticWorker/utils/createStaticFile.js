import { writeFile } from '../../../../util/fs/write';
import logError from './logError';
import handleError from './handleError';

export default async ({
  event, context, callback,
  folderPath, logFolderPath,
  staticDataItem, htmlGenerator,
}) => {
  const { id } = staticDataItem;
  const result = await htmlGenerator.lambdaAPI.run(event, context);
  if (result.statusCode !== 200) {
    logError(staticDataItem, JSON.stringify(result), logFolderPath);
    handleError(id, callback);
  } else {
    writeFile(`${folderPath}/${id}.html`, result.body);
  }
};
