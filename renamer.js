"use strict";
/**
 * SeyyedMahdi hassanpour
 * Seyyedkhandon@gmail.com
 * ISC license
 * Note: your new_names.txt must have new names based on the same naming order as youre
 * files are in the directory. then after make sure it satisfy the condition,
 * set the currect file type
 */
var fs = require('fs');
// list of new names and type of files
var listOfNewNames = 'new_names.txt';
var fileType = 'webm';
var oldNames = [...Array(59).keys()].map(i => "lesson" + (i + 1) + ".webm");
function safeName(text) {
    return text.replace(/[^\w\s]/gi, '')
}
fs.readFile(listOfNewNames, "utf8", function (err, content) {
    if (err) throw err;
    //read new names which is splited by "enter" in the file
    const new_names = content
        .split("\r\n")
        .map((new_name, index) => `lesson.${index + 1}_${safeName(new_name)}.${fileType}`);

    //read all file names which we want to change
    oldNames.forEach((old_file_name, index) => {
        // change file name
        fs.rename(old_file_name, new_names[index], function (err) {
            if (err) console.log("ERROR: " + err);
            console.log(`${old_file_name} --> ${new_names[index]}`);
            if (index === new_names.length - 1) console.log("Finished.");
        });
    });
});
