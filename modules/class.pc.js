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
        /*
        onValue=true;
        if (this.alive===false) {
            Home.message.publish('ping', {
                hostname: this.hostname
            });
            //Home.ioclient.write('ping' + this.hostname + ' wake');
            var dit = this;
            setTimeout(function(){ 
                pcInterval = setInterval(function() {
                    dit.ping(dit.hostname);
                }, pingPcInterval);
                setTimeout(function() { dit.pingVlc(dit.hostname); },startVlcTimeout);
            },startPcTimeout);
        }
        */
    },
    shutdown: function() {
        Home.message.publish('shutdown', {
            hostname: this.hostname,
            shutdownCommand: this.shutdownCommand
        });
        /*
        onValue=false;
        clearInterval(pcInterval);
        this.stopVlc();
        this.alive=false;
        if (this.hostname !== undefined) {
            Home.ioclient.write('pc ' + this.hostname + ' shutdown');
        } else {
            console.log('ERROR: class pc, shutdown, no hostname');
        }
        */
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
    /*
    getStatus: function(){
        var status = {
        };
        status.hostname = this.hostname;
        if (pcInterval) {
            status.on=true;
        } else {
            this.on=false;
        }
        status.alive=this.alive;
        status.vlcAlive=this.vlcAlive;
        return status;
    },
    */
    startVlc: function() {
        //TODO: start vlc
        vlcOnValue = true; 
        if (this.hostname !== undefined) {
            Home.ioclient.write('pc ' + this.hostname + ' vlc start');
            var dit = this;
            setTimeout(function(){ 
                vlcInterval = setInterval(function() {
                    dit.pingVlc(dit.hostname);
                }, pingVlcInterval);
            },startVlcTimeout);
        } else {
            console.log('ERROR: class pc, start vlc, geen hostname');
        }
    },
    killVlc: function() {
        //TODO: kill vlc
        vlcOnValue = false; 
        if (this.hostname !== undefined) {
            clearInterval(vlcInterval);
            Home.ioclient.write('pc ' + this.hostname + ' vlc kill');
            this.vlcAlive=false;
        } else {
            console.log('ERROR: class pc, stop vlc, geen hostname');
        }
    },
    pingVlc: function(hostname) {
        Home.message.publish('ping', {
            vlcHost: hostname
        });
    },
    vlcCommand: function(data) {
        //TODO: vlc command
        console.log('VLC COMMAND:'); console.log(data);
    }
    /*
    wakeOnLan: function(){
        if (this.hostname !== undefined) {
            Home.ioclient.write('pc' + this.hostname + ' wake');
        } else {
            console.log('ERROR: class pc, wake, geen hostname');
        }
    },
    */
    /*
    shutdown: function() {
    }
    */
};

module.exports = pc;

