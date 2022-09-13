const readline = require('readline');
const fs = require('fs');

export function makeEpisodicSafeNames(names: string[], fileType: string) {
  return names.map(
    (name, index) => `ep.${index + 1}_${safeName(name)}.${fileType}`,
  );
}
export function sortFiles(list: string[]) {
  return list.sort((a: string, b: string) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
  );
}
export function safeName(text: string) {
  return text.replace(/[^\w\s]/gi, '');
}
export function getFileTypeFromUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) => {
    rl.question(
      "What is the files format?\r\n(default is 'mp4')\r\n",
      (input: string) => {
        console.log(`\r\nThe Filetype is "${input}"\r\n`);
        rl.close();
        res(input);
      },
    );
  });
}
export function readReleatedFiles(fileType: string, directory = './') {
  const type = fileType.toLowerCase();
  return fs
    .readdirSync(directory)
    .filter((file: string) =>
      file.toLowerCase().includes(`${type}`),
    ) as string[];
}
export function copyFile(source = './', destination = './') {
  return new Promise((res, rej) =>
    fs.copyFile(source, destination, (err: any) => {
      if (err) rej(err);
      res(true);
    }),
  );
}
export async function copyFiles(
  files: string[],
  source = './',
  destination = './',
) {
  for (const file of files) {
    try {
      await copyFile(source + file, destination + file);
      console.log(file, ' Copied!');
    } catch (error) {
      if (!String(error).includes('no such file or directory')) throw error;
    }
  }
  return true;
}
export function deleteFile(filePath: string) {
  return new Promise((res, rej) => {
    fs.unlink(filePath, (err: any) => {
      if (err) rej(err);
      res(true);
    });
  });
}
export async function deleteFiles(files: string[], directory = './') {
  for (const file of files) {
    try {
      await deleteFile(directory + file);
      console.log(file, 'Deleted!');
    } catch (error) {
      if (!String(error).includes('no such file or directory')) throw error;
    }
  }
  return true;
}

export function readNewNamesFromFile(filePath: string): Promise<string[]> {
  return new Promise((res) => {
    fs.readFile(filePath, 'utf8', function (err: any, content: string) {
      if (err) throw err;
      res(content.split('\r\n'));
    });
  });
}

export function renameFile(oldName: string, newName: string, directory = './') {
  return new Promise((res, rej) => {
    fs.rename(directory + oldName, directory + newName, function (err: any) {
      if (err) rej(err);
      res(true);
    });
  });
}
export async function renameFiles(
  oldNames: string[],
  newNames: string[],
  directory = './',
) {
  for (const [index, oldName] of oldNames.entries()) {
    try {
      await renameFile(oldName, newNames[index], directory);
      console.log(`${oldName} --> ${newNames[index]}`);
    } catch (error) {
      if (!String(error).includes('no such file or directory')) throw error;
    }
  }
  console.log('Finished.');
  return true;
}

export function cleanDirectory(fileType: string, path: string) {
  // Select and Delete Old files for clean test
  const oldFiles = readReleatedFiles(fileType, path);
  console.log('cleanDirectory- files:', oldFiles);
  return deleteFiles(oldFiles, path);
}
export function copyAssets(
  fileType: string,
  source: string,
  destination: string,
) {
  const files = readReleatedFiles(fileType, source);
  console.log('copyAssets- files:', files);
  return copyFiles(files, source, destination);
}

export async function bulkRenamer(fileType = 'mp4', directory = './') {
  const oldNames = sortFiles(readReleatedFiles(fileType as string, directory));
  if (oldNames.length === 0) return console.log('There is no file to rename');
  const newNames = await readNewNamesFromFile(directory + 'names.txt');
  const episodicNames = makeEpisodicSafeNames(newNames, fileType);
  console.log(oldNames, newNames, episodicNames);
  return renameFiles(oldNames, episodicNames, directory);
}
