var fs = require('fs');
module.exports = {
    load: function(path, object, callback) {
        console.log(path);
        if (object === undefined) { object = {}; }
        if (path.substr(path.length-1) !== '/') { path += '/'; }
        fs.readdir(path, function(err, files) {
            var i,j,tmp;
            for (i = 0; i < files.length; i++) {
                if (files[i] !== 'loader.js') {
                    console.log('loading: ' + files[i] + " ...");
                    var fl = files[i].split('.');
                    if (fl.length > 1) {
                        if (fl[fl.length-1] === 'js') { 
                            switch (fl.length) {
                                case 2:
                                    object[fl[0]] = require(path+files[i]);
                                    break;
                                case 3:
                                    if (object[fl[0]] === undefined) { object[fl[0]] = {}; }
                                    object[fl[0]][fl[1]] = require(path+files[i]);
                                    break;
                                case 4:
                                    if (object[fl[0]] === undefined) { object[fl[0]] = {}; }
                                    if (object[fl[0]][fl[1]] === undefined) { object[fl[0]][fl[1]] = {}; }
                                    object[fl[0]][fl[1]][fl[2]] = require(path+files[i]);
                                    break;
                                case 5:
                                    if (object[fl[0]] === undefined) { object[fl[0]] = {}; }
                                    if (object[fl[0]][fl[1]] === undefined) { object[fl[0]][fl[1]] = {}; }
                                    if (object[fl[0]][fl[1]][fl[2]] === undefined) { object[fl[0]][fl[1]][fl[2]] = {}; }
                                    object[fl[0]][fl[1]][fl[2]][fl[3]] = require(path+files[i]);
                                    break;
                                default:
                                    if (object[fl[0]] === undefined) { object[fl[0]] = {}; }
                                    if (object[fl[0]][fl[1]] === undefined) { object[fl[0]][fl[1]] = {}; }
                                    if (object[fl[0]][fl[1]][fl[2]] === undefined) { object[fl[0]][fl[1]][fl[2]] = {}; }
                                    if (object[fl[0]][fl[1]][fl[2]][fl[3]] === undefined) { object[fl[0]][fl[1]][fl[2]][fl[3]] = {}; }
                                    var rest="";
                                    for (j = 3; j < fl.length -1; j++) {
                                        if (rest.length > 0) { rest += "."; }
                                        rest += fl[j];
                                    }
                                    object[fl[0]][fl[1]][fl[2]][fl[3]][rest] = require(path+files[i]);
                                    break;
                            }
                        }
                    }
                }
            }
            callback(object);
        });
    }
};
