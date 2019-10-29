import { createFolder } from '../../../util/fs/create';

export default (folderPath, logFolderPath, currDateTime) => {
  console.info('Starting creating folders');
  createFolder(folderPath);
  createFolder(`${folderPath}/${currDateTime}`);
  createFolder(logFolderPath);
  createFolder(`${logFolderPath}/${currDateTime}`);
  console.info('Finished creating folders');
};
