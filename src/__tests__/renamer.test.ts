import {
  cleanDirectory,
  copyAssets,
  readReleatedFiles,
  bulkRenamer,
} from '../utils';
const fileType = 'PNG';
const path = './src/__tests__/';

it('bulk rename', async () => {
  await cleanDirectory(fileType, path);
  await copyAssets(fileType, path + 'assets/', path);
  await bulkRenamer(fileType, path);

  expect(readReleatedFiles(fileType, path)).toEqual([
    'ep.1_luffy.PNG',
    'ep.2_zoro.PNG',
    'ep.3_sanji.PNG',
    'ep.4_sanji.PNG',
  ]);
});
