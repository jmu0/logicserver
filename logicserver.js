/*global Home: true */
var loader = require('./modules/loader.js');
var rootpath = '/home/jos/nodejs/logicserver/';
Home = {};
loader.load(rootpath + 'modules/', Home, function(){
    console.log(Home);
});
