/**
 * SeyyedMahdi hassanpour
 * Seyyedkhandon@gmail.com
 * ISC license
 * Note: your new_names.txt must have new names based on the same naming order as youre
 * files are in the directory. then after make sure it satisfy the condition,
 * set the currect file type
 */
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

// //read new names
// fs.readFile(newNamesFile, "utf8", function (err, content) {
//   if (err) throw err;
//   //read new names which is splited by "enter" in the file
//   const new_names = content
//     .split("\r\n")
//     .map((_, index) => `${index}_${_}.${fileType}`);

//   //read all file names which we want to change
//   glob(`*.${fileType}`, function (er, files_names) {
//     if (er) throw er;
//     files_names.forEach((old_file_name, index) => {
//       // change file name
//       fs.rename(old_file_name, new_names[index], function (err) {
//         if (err) console.log("ERROR: " + err);
//         console.log(`${old_file_name} --> ${new_names[index]}`);
//         if (index === new_names.length - 1) console.log("Finished.");
//       });
//     });
//   });
// });
