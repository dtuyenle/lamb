import fs from 'fs';
import path from 'path';

/**
  * Delete file
  * @param {String} filePath - Source file Path to delete.
  */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
  * Delete folder and all files inside the folder
  * @param {String} folderPath - Source folder Path to delete.
  */
const deleteFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const currSource = path.join(folderPath, file);
    deleteFile(currSource);
  });

  fs.rmdirSync(folderPath);
};

export {
  deleteFile,
  deleteFolder,
};
