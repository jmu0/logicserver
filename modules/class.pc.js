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
    wake: function() {
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
    },
    shutdown: function() {
        onValue=false;
        clearInterval(pcInterval);
        this.stopVlc();
        this.alive=false;
        if (this.hostname !== undefined) {
            Home.ioclient.write('pc ' + this.hostname + ' shutdown');
        } else {
            console.log('ERROR: class pc, shutdown, no hostname');
        }
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
    pong: function(value) {
        if (Home.debug) { console.log('pc ' + this.hostname + ' pong: '+value); }
        if (value==='alive') {
            this.alive = true;
        } else if (value==='dead'){
            this.alive = false;
        }
    },
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
    startVlc: function() {
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
        if (hostname !== undefined) {
            Home.ioclient.write('pc ' + hostname + ' vlc ping');
        } else {
            console.log('ERROR: class vlc, ping, geen hostname');
        }
    },
    pongVlc: function(value) {
        if (value==='alive') {
            this.vlcAlive=true;
        } else if (value==='dead'){
            this.vlcAlive = false;
            /*
            if (vlcOnValue=== true) {
                clearInterval(vlcInterval);
                this.startVlc();
            }
            */
        }
    },
    wakeOnLan: function(){
        if (this.hostname !== undefined) {
            Home.ioclient.write('pc' + this.hostname + ' wake');
        } else {
            console.log('ERROR: class pc, wake, geen hostname');
        }
    },
    /*
    shutdown: function() {
    }
    */
};

module.exports = pc;

