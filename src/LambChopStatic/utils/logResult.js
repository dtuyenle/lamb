import { writeFile } from '../../../util/fs/write';

export default (START_TIME, logFolderPath) => {
  const STOP_TIME = new Date();
  const timeTaken = STOP_TIME.getTime() - START_TIME.getTime();
  const msg = `Finished in ${timeTaken}ms`;
  writeFile(`${logFolderPath}/result.txt`, msg);
  console.info(msg);
};
