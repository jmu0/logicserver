/*global Home: true */
var loader = require('./modules/loader.js');
var rootpath = '/var/local/node/logicserver/';
Home = { rootpath:rootpath };
loader.load(rootpath + 'modules/', Home, function(){
    console.log(Home);
});
