"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SeyyedMahdi hassanpour
 * Seyyedkhandon@gmail.com
 * ISC license
 * Note: your new_names.txt must have new names based on the same naming order as youre
 * files are in the directory. then after make sure it satisfy the condition,
 * set the currect file type
 */
var fs = require('fs');
var glob = require('glob');
var Rx = require('rxjs');
var _a = require('rxjs/operators'), map = _a.map, mergeMap = _a.mergeMap;
var readFile$ = Rx.bindNodeCallback(fs.readFile);
var listDirectory$ = Rx.bindNodeCallback(glob);
var renameFile$ = Rx.bindNodeCallback(fs.rename);
// list of new names and type of files
var listOfNewNames = 'new_names.txt';
var fileType = 'PNG';
// methods
exports.extractNames = function (text) { return text.split('\r\n'); };
exports.nameGenerator = function (name, index) { return index + "_" + name + "." + fileType; };
var observer = {
    next: function (_) { return console.log(_.old_name + " --> " + _.new_name); },
    error: function (err) { return console.log(err); },
    complete: function () { return console.log('Finished.'); },
};
//observables
var newNames$ = readFile$(listOfNewNames, 'utf8').pipe(mergeMap(exports.extractNames), map(exports.nameGenerator));
var oldNames$ = listDirectory$("*." + fileType).pipe(mergeMap(Rx.from));
var renameFile = function (names_pair) {
    var old_name = names_pair[0], new_name = names_pair[1];
    renameFile$(old_name, new_name).subscribe();
    return { old_name: old_name, new_name: new_name };
};
// run
Rx.zip(oldNames$, newNames$).pipe(map(renameFile)).subscribe(observer);
