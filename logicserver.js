/*global Home: true */
var loader = require('./modules/loader.js');
var rootpath = '/var/local/node/logicserver/';
Home = { 
    rootpath: rootpath, 
    debug: false,
    loader: loader
};

var arg = process.argv[2];
if (arg !== undefined && arg === 'debug'){
    Home.debug=true;
    console.log('writing debug messages...');
}

Home.loader.on('ready', function(){
    console.log('loader ready...');
    if (Home.debug) {
        console.log(require('util').inspect(Home, true, 10));//10 levels
    }
});
Home.loader.load(rootpath + 'modules/', Home);
