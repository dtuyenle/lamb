import { writeFile } from '../../../../util/fs/write';

export default (data, error, logFolderPath) => {
  const logInfo = `
    ${JSON.stringify(data)}
    ${error}
  `;
  writeFile(`${logFolderPath}/error.txt`, logInfo);
};
