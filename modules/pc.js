/*global Home */
var list = require('../data/pc.list.js');
var pc = require('./class.pc.js');
var i,dev;

for (i = 0; i < list.length; i++) {
    list[i] = new pc(list[i]);
}

//ping all pc's / vlc's after 5 seconds to get status
setTimeout(function() {
    for (i = 0; i < list.length; i++) {
        list[i].ping(list[i].hostname);
    }
},500);

setTimeout(function() {
    for (i = 0; i < list.length; i++) {
        list[i].pingVlc(list[i].hostname);
    }
},1000);

/*DEBUG:
setTimeout(function() {
    console.log(Home.pc);
},10*1000);
*/

for (i=0; i < list.length; i++){
    dev = list[i];
    if (dev.room !== undefined && dev.type !== undefined && dev.hostname !== undefined) { 
        if (Home[dev.room] === undefined){ Home[dev.room] = {}; }
        if (Home[dev.room][dev.type] === undefined){ Home[dev.room][dev.type] = {}; }
        Home[dev.room][dev.type][dev.hostname] = dev;
    }
}

module.exports = {
    list: list,
    find: function(hostname) {
        var ret; 
        for (i=0; i < this.list.length; i++){
            if (this.list[i].hostname === hostname) {
                ret=this.list[i];
            }
        }
        return ret;
    },
    doCommand: function(cmd) {
        if (Home.debug) { console.log('pc command: '+cmd); }
        var command = cmd.split(' ');
        var host,hostname;
        //DEBUG: console.log(command);
        if (command[1] !== undefined) {
            hostname = command[1];
            host=Home.pc.find(hostname);
            if (host) {
                if (command[2] !== undefined) {
                    if (command[2] === 'on') {
                        host.on();
                    } else if (command[2]==='off') { 
                        host.off();
                    } else if (command[2] === 'vlc') {
                        if (command[3] !== undefined) {
                            if (command[3] === 'start') {
                                host.startVlc();
                            } else if (command[3] === 'stop') {
                                host.stopVlc();
                            }
                        }
                    } else {
                        Home.ui.websocket.broadcast('ERROR: pc command unknown');
                    }
                } else {
                    Home.ui.websocket.broadcast('ERROR: pc no command');
                }
            } else {
                Home.ui.websocket.broadcast('ERROR: pc host: '+hostname+ ' not found');
            }
        } else {
            Home.ui.websocket.broadcast('ERROR: pc host unknown');
        }
    }
};
