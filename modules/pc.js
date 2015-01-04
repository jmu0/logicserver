/*global Home */
var list = require('../data/pc.list.js');
var pc = require('./class.pc.js');
var i, dev;
var pingInterval = 3 * 1000;
var pingVlcInterval = 3 * 1000;

if (Home.debug) { pingInterval = 30 * 1000; pingVlcInterval = 30 * 1000; }

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
setInterval(function() {
    for (i = 0; i < list.length; i++) {
        list[i].ping(list[i].hostname);
    }
}, pingInterval);

setInterval(function() {
    for (i = 0; i < list.length; i++) {
        list[i].pingVlc(list[i].hostname);
    }
}, pingVlcInterval);

Home.loader.on('ready', function() {
    Home.message.on('pc', Home.pc.doCommand);//from websocket / state / controller
    Home.message.on('pong', Home.pc.pong);
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
    pong: function(data) {
        var pc;
        if (data.hostname) { //is pc pong
            pc = Home.pc.find(data.hostname);
            if (pc) {
                if (data.pong === 'alive' && pc.alive === false) {
                    pc.alive=true;
                    Home.message.publish('update', pc);
                } else if (data.pong === 'dead' && pc.alive === true){
                    pc.alive=false;
                    Home.message.publish('update', pc);
                }
            }
        } else if (data.vlcHost) { //is vlc pong
            pc = Home.pc.find(data.vlcHost);
            if (pc) {
                if (data.pong === 'alive' && pc.vlcAlive === false) {
                    pc.vlcAlive=true;
                    Home.message.publish('update', pc);
                } else if (data.pong === 'dead' && pc.vlcAlive === true){
                    pc.vlcAlive=false;
                    Home.message.publish('update', pc);
                }
            }
        }
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
                        //DEBUG: console.log('PC SHUTDOWN COMMAND:'); console.log(host);
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
