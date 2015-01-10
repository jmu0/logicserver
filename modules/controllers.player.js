/*jslint todo: true */
/*global Home */
var player = {
    playlist: [],
    findFilename: function(filename) {
        var ret;
        this.playlist.forEach(function(item) {
            if (item.filename === filename) { 
                ret = item;
            }
        });
        return ret;
    },
    checkPlayersInterval: undefined,
    checkPlayers: function() {
        if (Home.debug) { console.log('checking players...'); }
        Home.pc.list.forEach(function(pc) {
            if (pc.vlcAlive) {
                Home.message.publish('vlc', {
                    hostname: pc.hostname,
                    vlc: 'playing'
                });
            }
        });
    },
    getTimeInterval: [],
    returnTime: function(data) {
        if (Home.debug) { console.log("VLC RETURN TIME"); console.log(data); }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            pc.time = data.time;
            if (pc.playingFile) {
                var file = this.findFilename(pc.playingFile);
                if (file){
                    file.time = data.time;
                }
            }
            Home.message.publish('updateTime', {
                hostname: pc.hostname,
                playingFile: pc.playingFile,
                isPlaying: pc.isPlaying,
                time: pc.time,
                length: pc.length
            });
        }
    },
    returnLength: function(data) {
        if (Home.debug) { console.log('VLC LENGTH: '); console.log(data); }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            pc.length = data.length;
            if (pc.playingFile) {
                var file = this.findFilename(pc.playingFile);
                if (file){
                    file.length = data.length;
                }
            }
            Home.message.publish('updateTime', {
                hostname: pc.hostname,
                playingFile: pc.playingFile,
                isPlaying: pc.isPlaying,
                time: pc.time,
                length: pc.length
            });
        }
    },
    returnPlaying: function(data) {
        if (Home.debug) { console.log('VLC PLAYING: '); console.log(data); }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            if (data.playing === "1") {
                if (pc.isPlaying === false) {
                    pc.isPlaying = true;
                    console.log(Home.pc);
                    Home.controllers.player.getTimeInterval[pc.hostname] = setInterval(function(){
                        Home.message.publish('vlc', {
                            hostname: pc.hostname,
                            vlc: "time"
                        });
                    }, 1000);
                }
                if (pc.length <= 0) {
                    Home.message.publish('vlc', {
                        hostname: pc.hostname,
                        vlc: 'length'
                    });
                }
            } else {
                    if (pc.isPlaying === true) {
                        pc.isPlaying = false;
                        if (Home.controllers.player.getTimeInterval[pc.hostname]) {
                            clearInterval(Home.controllers.player.getTimeInterval[pc.hostname]);
                        }
                    }
            }
        }
    }
};

Home.loader.on('ready', function() {
    Home.message.on('player', function(data) {
        console.log("PLAYER:");
        console.log(data);
    });
    Home.message.on('vlclength', player.returnLength);
    Home.message.on('vlctime', player.returnTime);
    Home.message.on('vlcplaying', player.returnPlaying);
});

player.checkPlayersInterval = setInterval(player.checkPlayers, 5000);

module.exports = player;
