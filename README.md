# RenamerTool
Rename files based on a list you provide (like a bunch of videos that you want to change all of them to a new list based on table of contents)


 * SeyyedMahdi hassanpour
 * Seyyedkhandon@gmail.com
 * ISC license 
 * Note: your new_names.txt must have new names based on the same naming order as your'e files are in the directory. then after make sure it satisfy the condition, set the correct file type 
 * to run this, first "npm i", then "node renamer.js"
 
this is a stand-alone package which you can download and use it.

<pre>
const fs = require("fs");
const glob = require("glob");
const Rx = require("rxjs");
const { map, mergeMap } = require("rxjs/operators");
const readFileAsObservable$ = Rx.bindNodeCallback(fs.readFile);
const listDirectoryAsObservable$ = Rx.bindNodeCallback(glob);
const renameFileAsObservable$ = Rx.bindNodeCallback(fs.rename);
// list of new names and type of files
const newNamesFile = "new_names.txt";
const fileType = "PNG";
// methods
const splitTextToNames = (text) => text.split("\r\n");
const nameGenerator = (name, index) => `${index}_${name}.${fileType}`;
const observer = {
  next: (_) => console.log(`${_.old_name} --> ${_.new_name}`),
  error: (err) => console.log(err),
  complete: () => console.log("Finished."),
};
//observables
const newNames$ = readFileAsObservable$(newNamesFile, "utf8").pipe(
  mergeMap(splitTextToNames),
  map(nameGenerator)
);
const currentFilesNames$ = listDirectoryAsObservable$(`*.${fileType}`).pipe(
  mergeMap(Rx.from)
);
const renameFile = (names_pair) => {
  const [old_name, new_name] = names_pair;
  renameFileAsObservable$(old_name, new_name).subscribe();
  return { old_name, new_name };
};

Rx.zip(currentFilesNames$, newNames$).pipe(map(renameFile)).subscribe(observer); 
</pre>

