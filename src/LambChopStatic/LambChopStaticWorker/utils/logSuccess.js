import { writeFile } from '../../../../util/fs/write';

export default (id, logFolderPath) => {
  const logInfo = `${id}\n`;
  writeFile(`${logFolderPath}/success.txt`, logInfo);
};
