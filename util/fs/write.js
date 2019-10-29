import fs from 'fs';
import { createFile } from './create';

/**
  * Write file
  * @param {String} filePath - File path.
  */
const writeFile = (filePath, content) => {
  createFile(filePath);
  fs.appendFileSync(filePath, content);
};

export { writeFile };
