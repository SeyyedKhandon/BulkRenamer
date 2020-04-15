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
const operators = require("rxjs/operators");

const newNamesFile = "new_names.txt";
const fileType = "PNG";

const readFileAsObservable$ = Rx.bindNodeCallback(fs.readFile);
const listDirectoryAsObservable$ = Rx.bindNodeCallback(glob);
const renameFileAsObservable$ = Rx.bindNodeCallback(fs.rename);

const newNames$ = readFileAsObservable$(newNamesFile, "utf8").pipe(
  operators.mergeMap((_) => _.split("\r\n")),
  operators.map((_, index) => `${index}_${_}.${fileType}`)
);

const currentFilesNames$ = listDirectoryAsObservable$(`*.${fileType}`).pipe(
  operators.mergeMap((_) => Rx.from(_))
);
Rx.zip(currentFilesNames$, newNames$)
  .pipe(
    operators.tap((name_pair) => {
      const [old_name, new_name] = name_pair;
      renameFileAsObservable$(old_name, new_name).subscribe();
    })
  )
  .subscribe({
    next: (_) => console.log(`${_[0]} --> ${_[1]}`),
    error: Rx.noop,
    complete: () => console.log("Finished."),
  });

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
