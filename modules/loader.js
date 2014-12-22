/*jslint todo: true */
/*global Home */

var fs = require('fs');

function getExtension(filename) {
    var ext = String(filename).split('.');
    return ext[ext.length - 1];
}

module.exports = {
    //TODO: OUD: load: function(path, object, callback) {
    load: function(path, object) {
        var i,j,fl,rest;
        console.log(path);
        if (object === undefined) { object = {}; }
        if (path.substr(path.length-1) !== '/') { path += '/'; }
        fs.readdir(path, function(err, files) {
            if (err) { console.log(err); }
            for (i = 0; i < files.length; i++) {
                if (files[i] !== 'loader.js' && (getExtension(files[i] === 'js' || getExtension(files[i])=== 'json'))) {
                    console.log('loading: ' + files[i] + " ...");
                    fl = files[i].split('.');
                    if (fl.length > 1) {
                        if (fl[fl.length-1] === 'js') { 
                            //TODO: dit kan beter
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
                                rest="";
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
            //TODO: OUD: callback(object);
            for(i=0; i < Home.loader.readyCallbacks.length; i++){
                Home.loader.readyCallbacks[i]();
            }
        });
    },
    readyCallbacks: [],
    on: function(name, callback) {
        if (name==='ready'){
            this.readyCallbacks.push(callback);
        }
    }
};
