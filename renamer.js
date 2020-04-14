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

const newNamesFile = "new_names.txt";
const fileType = "PNG";

//read new names
fs.readFile(newNamesFile, "utf8", function (err, content) {
  if (err) throw err;
  //read new names which is splited by "enter" in the file
  const new_names = content
    .split("\r\n")
    .map((_, index) => `${index}_${_}.${fileType}`);

  //read all file names which we want to change
  glob(`*.${fileType}`, function (er, files_names) {
    if (er) throw er;
    files_names.forEach((old_file_name, index) => {
      // change file name
      fs.rename(old_file_name, new_names[index], function (err) {
        if (err) console.log("ERROR: " + err);
        console.log(`${old_file_name} --> ${new_names[index]}`);
        if (index === new_names.length - 1) console.log("Finished.");
      });
    });
  });
});
