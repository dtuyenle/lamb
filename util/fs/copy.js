import fs from 'fs';
import path from 'path';
import { deleteFile } from './delete';

/**
  * Copy file
  * @param {String} srcFilePath - Source file Path.
  * @param {String} destFilePath - Destination file Path.
  * @param {Function} transformFunc - If defined,
  * this function will take the content of source file and
  * return the formatted version to destination file.
  * @param {Bool} deleteBeforeCopy - Delete destination file before copy.
  */
const copyFile = (srcFilePath, destFilePath, transformFunc, deleteBeforeCopy = true) => {
  if (deleteBeforeCopy) {
    deleteFile(destFilePath);
  }
  if (transformFunc) {
    const srcContent = fs.readFileSync(srcFilePath, 'utf8');
    fs.writeFileSync(destFilePath, transformFunc(srcContent));
  } else {
    fs.copyFileSync(srcFilePath, destFilePath);
  }
};

/**
  * Copy folder recursively ( including all nested folders and files )
  * @param {String} srcFolderPath - Source folder Path.
  * @param {String} destFolderPath - Destination folder Path.
  */

const copyFolder = (srcFolderPath, destFolderPath) => {
  let files = [];

  // Check if folder needs to be created
  const currDestination = path.join(destFolderPath, path.basename(srcFolderPath));
  if (!fs.existsSync(currDestination)) {
    fs.mkdirSync(currDestination);
  }

  // Copy reursively
  if (fs.lstatSync(srcFolderPath).isDirectory()) {
    files = fs.readdirSync(srcFolderPath);
    files.forEach((file) => {
      const currSource = path.join(srcFolderPath, file);
      if (fs.lstatSync(currSource).isDirectory()) {
        copyFolder(currSource, currDestination);
      } else {
        copyFile(currSource, `${currDestination}/${file}`);
      }
    });
  }
};

export {
  copyFile,
  copyFolder,
};
