/*jslint todo: true */
/*global Home */
var pingPcInterval  = 3000;
var pingVlcInterval = 3000;
var startPcTimeout  = 20000;
var startVlcTimeout = 2000;

function pc(props) {
    var pr;
    for (pr in props) {
        if (props.hasOwnProperty(pr)){
            this[pr]=props[pr];
        }
    }
}
var pcInterval,vlcInterval; //store timout variables
var onValue = false; 
var vlcOnValue = false;

pc.prototype = {
    alive: false,
    vlcAlive: false,
    wake: function() {
        Home.message.publish('wake', {
            hostname: this.hostname,
            mac: this.mac
        });
    },
    shutdown: function() {
        Home.message.publish('shutdown', {
            hostname: this.hostname,
            shutdownCommand: this.shutdownCommand
        });
    },
    ping: function(hostname) { //hostname required, in setinterval this=interval
        if (hostname !== undefined) {
            Home.message.publish('ping', {
                hostname: this.hostname
            });
            //Home.ioclient.write('pc ' + hostname + ' ping');
        } else {
            console.log('ERROR: class pc, ping, geen hostname');
        }
    },
    isPlaying: false,
    playingFile: undefined,
    time: 0,
    length: 0,
    startVlc: function() {
        vlcOnValue = false; 
        Home.message.publish('vlc', { 
            hostname: this.hostname,
            vlcStartCommand: this.vlcStartCommand,
            vlc: 'start'
        });
    },
    killVlc: function() {
        vlcOnValue = false; 
        this.isPlaying = false;
        this.playingFile = undefined;
        this.time = 0;
        this.length = 0; 
        Home.message.publish('vlc', { 
            hostname: this.hostname,
            vlcKillCommand: this.vlcKillCommand,
            vlc: 'kill'
        });
    },
    pingVlc: function(hostname) {
        Home.message.publish('ping', {
            vlcHost: hostname
        });
    },
    vlcCommand: function(data) {
        //TODO: vlc command
        console.log('VLC COMMAND:'); console.log(data);
    },
    translatePath: function(text) {
        if (Home.debug) { console.log('translating ' + text + ' for ' + this.hostname); }
        this.translate.forEach(function(item) {
            //DEBUG:
            console.log(item);
            text = text.replace(item.from, item.to);
        });
        return text;
    }
};

module.exports = pc;

