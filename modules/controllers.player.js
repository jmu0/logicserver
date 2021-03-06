/*jslint todo: true */
/*global Home */
var getTimeInterval = 1000;
if (Home.debug) { getTimeInterval = 10000; }

var player = {
    playlist: [],
    init: function(data){
        //initialize player on websocket
        /*
        if (data.iodevice === 'player') { 
            Home.message.publish('updatePlayers',Home.pc.list);
            Home.message.publish('updatePlaylist',Home.controllers.player.playlist);
        }
        */
    },
    command: function(data) {
        var i;
        if (Home.debug) {
            console.log("PLAYER:");
            console.log(data);
        }
        if (data.command === 'playfile') {
            if (Home.debug) { console.log('ADD file to queue'); }
            player.playlist.push({
                filename: data.filename,
                hostname: data.hostname,
                length: 0,
                time: 0,
                played: 0
            });
            if (Home.debug) { console.log(Home.controllers.player.playlist); }
            Home.message.publish('updatePlaylist', Home.controllers.player.playlist);
            Home.controllers.player.checkPlayers();
        } else if (data.command === 'gotofile') {
            Home.controllers.player.gotoFile(data);
        } else if (data.command === 'playpause') {
            Home.message.publish('vlc', {
                hostname: data.hostname,
                vlc: 'pause'
            });
        } else if (data.command === 'stop') {
            Home.message.publish('vlc', {
                hostname: data.hostname,
                vlc: 'stop'
            });
        } else if (data.command === 'previous') {
            Home.controllers.player.playPrevious(data.hostname);
        } else if (data.command === 'next') {
            Home.controllers.player.playNext(data.hostname);
        } else if (data.command === 'seek') {
            Home.controllers.player.seek(data);
        } else if (data.command === 'clear') {
            Home.message.publish('vlc', {
                hostname: data.hostname,
                vlc: 'clear'
            });
            Home.controllers.player.playlist = [];
        } else if (data.command === 'removePlaylistItem') {
            if (Home.debug) { console.log("remove playlist item:"); console.log(data); }
            for(i=0; i< Home.controllers.player.playlist.length; i++) {
                if (Home.controllers.player.playlist[i].filename === data.filename) {
                    Home.controllers.player.playlist.splice(i,1);
                    Home.message.publish('updatePlaylist', Home.controllers.player.playlist);
                    break;
                }
            }
        } else if (data.command === 'updatePlaylistItem') {
            var oldhost;
            if (Home.debug) { console.log("update playlist item:"); console.log(data); }
            for(i=0; i< Home.controllers.player.playlist.length; i++) {
                if (Home.controllers.player.playlist[i].filename === data.filename) {
                    if (data.hostname !== undefined) {
                        oldhost = Home.pc.find(Home.controllers.player.playlist[i].hostname);
                        Home.controllers.player.playlist[i].hostname = data.hostname;
                        if (oldhost) {
                            if (oldhost.playingFile === data.filename) {
                                Home.message.publish('vlc', {
                                    hostname: oldhost.hostname,
                                    vlc: 'stop'
                                });
                            }
                        }
                    }
                    Home.message.publish('updatePlaylist', Home.controllers.player.playlist);
                    break;
                }
            }
        } else {
            Home.message.publish('vlc', {
                hostname: data.hostname,
                vlc: data.command
            });
        }
    },
    getNext: function(hostname) {
        var file, fileindex, i, n;
        var pc = Home.pc.find(hostname);
        var startindex = 0;
        if (pc !== undefined && pc.lastPlayedFile !== undefined) {
            fileindex = Home.controllers.player.findFilenameIndex(pc.lastPlayedFile);
            if (fileindex !== undefined) {
                startindex = fileindex + 1;
                if (startindex >= this.playlist.length) { startindex -= this.playlist.length; }
            }
        }
        if (Home.debug) { console.log('GETNEXT (startindex): '+startindex); }
        for (i = startindex; i < (this.playlist.length + startindex); i++) {
            n=i;
            if (n >= this.playlist.length) { n -= this.playlist.length; }
            if (this.playlist[n].hostname === hostname) {
                file = this.playlist[n];
                if (Home.debug) { console.log('GETNEXT file:' + file.filename); }
                break;
            }
        }
        return file;
    },
    getPrevious: function(hostname) {
        var file, fileindex, i, n;
        var pc = Home.pc.find(hostname);
        var startindex = 0;//this.playlist.length -1;
        if (pc !== undefined && pc.lastPlayedFile !== undefined) {
            if (Home.debug) { console.log('GETPREVIOUS: last played file: '+pc.lastPlayedFile); }
            fileindex = Home.controllers.player.findFilenameIndex(pc.lastPlayedFile);
            if (Home.debug) { console.log('GETPREVIOUS: gevonden fileindex:'+fileindex); }
            if (fileindex !== undefined) {
                startindex = fileindex - 1;
                if (startindex < 0) { startindex = this.playlist.length + startindex; }
            }
        }
        if (Home.debug) { console.log('GETPREVIOUS startindex: '+startindex); }
        for (i = startindex; i > (startindex - this.playlist.length); i--) {
            n=i;
            if (n < 0) { n = this.playlist.length + n; }
            if (this.playlist[n].hostname === hostname) {
                file = this.playlist[n];
                if (Home.debug) { console.log('GETPREVIOUS file:' + file.filename); }
                break;
            }
        }
        return file;
        /*
        var file, i;
        var pc = Home.pc.find(hostname);
        if (pc !== undefined) {
            if (pc.playingFile !== undefined) {
                i = Home.controllers.player.findFilenameIndex(pc.playingFile);
            } else {
                console.log('player getprevious: host not playing a file: '+hostname);
            }
        } else { 
            console.log('player getprevious: host not found: '+hostname);
        }
        if (i === undefined) { 
            i=this.playlist.length-1; 
        } else {
            i--;
        }
        for (i; i >= 0; i--) {
            if (this.playlist[i].played > 0 && this.playlist[i].hostname === hostname) {
                file= this.playlist[i];
                break;
            }
        }
        return file;
        */
    },
    playNext: function(hostname) {
        //first incr. playcount then get next file
        console.log('PLAY NEXT: ' + hostname);
        var pc = Home.pc.find(hostname);
        if (pc !== undefined) {
            if (pc.playingFile !== undefined) {
                var file = Home.controllers.player.findFilename(pc.playingFile);
                if (file !== undefined) {
                    file.played++;
                }
            }
            var nextfile = this.getNext(hostname);
            if (nextfile !== undefined) {
                if (Home.debug) { console.log('next file is: '+ nextfile.filename); }
                pc.playingFile = nextfile.filename;
                pc.lastPlayedFile = nextfile.filename;
                pc.skipCheckPlayer = true; 
                Home.message.publish('vlc', {
                    hostname: pc.hostname,
                    vlc: 'play',
                    file: pc.translatePath(nextfile.filename)
                });
                if (nextfile.time > 0) {
                    Home.message.publish('vlc', {
                        hostname: pc.hostname,
                        vlc: 'seek ' + nextfile.time
                    });
                }
            } else {
                if (Home.debug) { console.log('No next file for '+hostname); }
            }
        } else {
            console.log('ERROR playnext: '+hostname+' not found.');
        }
    },
    playPrevious: function(hostname) {
        //don't increment playcount
        console.log('PLAY PREVIOUS: ' + hostname);
        var pc = Home.pc.find(hostname);
        if (pc !== undefined) {
            var prevfile = this.getPrevious(hostname);
            if (prevfile !== undefined) {
                if (Home.debug) { console.log('previous file is: '+prevfile.filename); }
                pc.playingFile = prevfile.filename;
                pc.lastPlayedFile = prevfile.filename;
                Home.message.publish('vlc', {
                    hostname: pc.hostname,
                    vlc: 'play',
                    file: pc.translatePath(prevfile.filename)
                });
                if (prevfile.time > 0) {
                    Home.message.publish('vlc', {
                        hostname: pc.hostname,
                        vlc: 'seek ' + prevfile.time
                    });
                }
            } else {
                if (Home.debug) { console.log('No previous file for '+hostname); }
            }
        } else {
            console.log('ERROR playnext: '+hostname+' not found.');
        }
    },
    seek: function(data) {
        if (data.position !== undefined) {
            var pc = Home.pc.find(data.hostname);
            if (pc) {
                pc.time = data.position;
                if (pc.playingFile){
                    var file = Home.controllers.player.findFilename(pc.playingFile);
                    if (file) {
                        file.time = data.position;
                    }
                }
            }
            Home.message.publish('vlc', {
                hostname: data.hostname,
                vlc: 'seek ' + data.position
            });
        } else {
            console.log('ERROR player seek:  no position');
        }
    },
    findFilename: function(filename) {
        var ret;
        this.playlist.forEach(function(item) {
            if (item.filename === filename) {
                ret = item;
            }
        });
        return ret;
    },
    findFilenameIndex: function(filename) {
        var ret, i;
        for (i=0; i<this.playlist.length; i++){
            //DEBUG: console.log(filename + " = " + this.playlist[i].filename);
            if (this.playlist[i].filename === filename) {
                ret = i;
                if (Home.debug) { console.log("FOUND:"+i); }
                break;
            }
        }
        return ret;
    },
    checkPlayersInterval: undefined,
    checkPlayers: function() {
        if (Home.debug) {
            console.log('checking players...');
        }
        Home.pc.list.forEach(function(pc) {
            if (pc.vlcAlive && pc.skipCheckPlayer === false) {
                Home.message.publish('vlc', {
                    hostname: pc.hostname,
                    vlc: 'playing'
                });
            } else {
                pc.skipCheckPlayer = false;
            }
        });
    },
    getTimeInterval: [],
    returnTime: function(data) {
        if (Home.debug) {
            console.log("VLC RETURN TIME");
            console.log(data);
        }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            pc.time = data.time;
            if (pc.playingFile) {
                var file = Home.controllers.player.findFilename(pc.playingFile);
                if (file) {
                    if (parseInt(file.time,10) >= parseInt(data.time,10)+2) { //resume last position
                        console.log("file time " + file.time + " > " + data.time + ", resuming...");
                        pc.time = file.time;
                        Home.message.publish('vlc', {
                            hostname: pc.hostname,
                            vlc: 'seek ' + file.time
                        });
                    } else {
                        file.time = data.time;
                    }
                }
            }
            if (pc.length < pc.time) {
                Home.message.publish('vlc', {
                    hostname: pc.hostname,
                    vlc: 'length'
                });
            } else {
                Home.message.publish('updateTime', {
                    hostname: pc.hostname,
                    playingFile: pc.playingFile,
                    isPlaying: pc.isPlaying,
                    time: pc.time,
                    length: pc.length
                });
            }
        }
        console.log(Home.controllers.player.playlist);
    },
    returnLength: function(data) {
        if (Home.debug) {
            console.log('VLC LENGTH: ');
            console.log(data);
        }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            pc.length = data.length;
            if (pc.playingFile) {
                var file = Home.controllers.player.findFilename(pc.playingFile);
                if (file) {
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
        if (Home.debug) {
            console.log('VLC PLAYING: ');
            console.log(data);
        }
        var pc = Home.pc.find(data.hostname);
        if (pc) {
            if (data.playing === "1") {
                if (pc.isPlaying === false) {
                    pc.isPlaying = true;
                    console.log(Home.pc);
                    Home.controllers.player.getTimeInterval[pc.hostname] = setInterval(function() {
                        Home.message.publish('vlc', {
                            hostname: pc.hostname,
                            vlc: "time"
                        });
                    }, getTimeInterval);
                    Home.message.publish('updatePlayers',Home.pc.list);
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
                    pc.playingFile = undefined; 
                    pc.time = 0;
                    pc.length = 0;
                    if (Home.controllers.player.getTimeInterval[pc.hostname]) {
                        clearInterval(Home.controllers.player.getTimeInterval[pc.hostname]);
                    }
                    Home.message.publish('updatePlayers',Home.pc.list);
                }
                Home.controllers.player.playNext(pc.hostname);
            }
        }
    }
};

Home.loader.on('ready', function() {
    Home.message.on('vlclength', player.returnLength);
    Home.message.on('vlctime', player.returnTime);
    Home.message.on('vlcplaying', player.returnPlaying);
    Home.message.on('player', player.command);
    Home.message.on('init', player.init);
    Home.message.on('vlc', function(data) {
        if (data.vlc === 'play') {
            Home.message.publish('updatePlayers', Home.pc.list);
        }
    });
});

player.checkPlayersInterval = setInterval(player.checkPlayers, 5000);

module.exports = player;
