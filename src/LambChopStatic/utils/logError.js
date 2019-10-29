import { writeFile } from '../../../util/fs/write';

export default (logFolderPath, error) => {
  console.error(error);
  console.error(`
    ========================================================================
      There were errors generating static files. Please check log file at:
      ${logFolderPath}
    ========================================================================
  `);
  writeFile(`${logFolderPath}/error.txt`, error);
};
