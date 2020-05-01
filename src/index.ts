/**
 * SeyyedMahdi hassanpour
 * Seyyedkhandon@gmail.com
 * ISC license
 * Note: your new_names.txt must have new names based on the same naming order as youre
 * files are in the directory. then after make sure it satisfy the condition,
 * set the currect file type
 */
const fs = require('fs');
const glob = require('glob');
const Rx = require('rxjs');
const { map, mergeMap } = require('rxjs/operators');
const readFile$ = Rx.bindNodeCallback(fs.readFile);
const listDirectory$ = Rx.bindNodeCallback(glob);
const renameFile$ = Rx.bindNodeCallback(fs.rename);

// list of new names and type of files
const listOfNewNames = 'new_names.txt';
const fileType = 'PNG';

// methods
export const extractNames = (text: string) => text.split('\r\n');
export const nameGenerator = (name: string, index: number) => `${index}_${name}.${fileType}`;
const observer = {
  next: (_: any) => console.log(`${_.old_name} --> ${_.new_name}`),
  error: (err: Error) => console.log(err),
  complete: () => console.log('Finished.'),
};
//observables
const newNames$ = readFile$(listOfNewNames, 'utf8').pipe(mergeMap(extractNames), map(nameGenerator));
const oldNames$ = listDirectory$(`*.${fileType}`).pipe(mergeMap(Rx.from));
const renameFile = (names_pair: string[]) => {
  const [old_name, new_name] = names_pair;
  renameFile$(old_name, new_name).subscribe();
  return { old_name, new_name };
};

// run
Rx.zip(oldNames$, newNames$).pipe(map(renameFile)).subscribe(observer);
