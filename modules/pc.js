/*global Home */
var list = require('../data/pc.list.js');
var pc = require('./class.pc.js');
var i, dev;


for (i = 0; i < list.length; i++) {
    list[i] = new pc(list[i]);
    dev = list[i];
    if (dev.room !== undefined && dev.type !== undefined && dev.hostname !== undefined) {
        if (Home[dev.room] === undefined) {
            Home[dev.room] = {};
        }
        if (Home[dev.room][dev.type] === undefined) {
            Home[dev.room][dev.type] = {};
        }
        Home[dev.room][dev.type][dev.hostname] = dev;
    }
}

//ping all pc's / vlc's after 500 miliseconds to get status
setTimeout(function() {
    for (i = 0; i < list.length; i++) {
        list[i].ping(list[i].hostname);
    }
}, 500);

setTimeout(function() {
    for (i = 0; i < list.length; i++) {
        list[i].pingVlc(list[i].hostname);
    }
}, 1000);

Home.loader.on('ready', function() {
    Home.message.on('pc', Home.pc.doCommand);
});

module.exports = {
    list: list,
    find: function(hostname) {
        var ret;
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i].hostname === hostname) {
                ret = this.list[i];
            }
        }
        return ret;
    },
    doCommand: function(cmd) {
        var host;
        if (Home.debug) {
            console.log('PC COMMAND: ');
            console.log(cmd);
        }
        if (cmd.hostname !== undefined) {
            host = Home.pc.find(cmd.hostname);
            if (host) {
                if (cmd.command !== undefined) {
                    if (cmd.command === 'wake') {
                        host.wake();
                    } else if (cmd.command=== 'shutdown') {
                        host.shutdown();
                    } else if (cmd.command === 'vlc') {
                        if (cmd.vlc !== undefined) {
                            if (cmd.vlc === 'start') {
                                host.startVlc();
                            } else if (cmd.vlc === 'kill') {
                                host.killVlc();
                            }
                        }
                    } else {
                        Home.message.publish('broadcast', 'ERROR: pc command unknown');
                    }
                } else {
                    Home.message.publish('broadcast', 'ERROR: pc no command');
                }
            } else {
                Home.message.publish('broadcast', 'ERROR: pc host: ' + cmd.hostname + ' not found');
            }
        } else {
            Home.message.publish('broadcast', 'ERROR: pc host unknown');
        }
    }
};
