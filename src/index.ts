import { bulkRenamer, getFileTypeFromUser } from './utils';

async function start() {
  const fileType = ((await getFileTypeFromUser()) as string) || 'mp4';
  return bulkRenamer(fileType, './');
}
start();
