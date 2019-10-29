import fs from 'fs';
import { deleteFolder } from './delete';
/**
  * Create file
  * @param {String} filePath - File path.
  */
const createFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, 'w'));
  }
};

/**
  * Create folder
  * @param {String} folderPath - Folder path.
  */
const createFolder = (folderPath, deleteBeforeCreate = false) => {
  const isExist = fs.existsSync(folderPath);
  if (deleteBeforeCreate && isExist) {
    deleteFolder(folderPath);
  }
  if (!isExist) {
    fs.mkdirSync(folderPath);
  }
};

export {
  createFile,
  createFolder,
};
