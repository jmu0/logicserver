/*jslint todo: true */
/*global Home, WebSocket, m */
function Player() {
    this.socketConnect();
    /*
    this.on('updatePlaylist', function(data){
        console.log('player updatePlaylist: '); console.log(data);
    });
    this.on('updateTime', function(data){
        console.log('player updateTime: '); console.log(data);
    });
    */
}
Player.prototype = {
    players: [],
    playlist: [],
    handlers: {},
    on: function(message, callback) {
        if (this.handlers[message] === undefined) {
            this.handlers[message] = [];
        }
        this.handlers[message].push(callback);
    },
    publish: function(message, data) {
        //console.log('Player publish message: ' + message);
        //console.log(data);
        if (this.handlers[message] !== undefined) {
            this.handlers[message].forEach(function(handler) {
                handler(data);
            });
        }
    },
    playfile: function(data) {
        data.command = 'playfile';
        this.socket.send('player ' + JSON.stringify(data));
        //TODO: play file now
    },
    enqueue: function(data) {
        data.command = 'playfile';
        this.socket.send('player ' + JSON.stringify(data));
    },
    previous: function(hostname) {
        var data = {
            command: 'previous',
            hostname: hostname
        };
        this.socket.send('player ' + JSON.stringify(data));
    },
    playpause: function(hostname) {
        var data = {
            command: 'playpause',
            hostname: hostname
        };
        this.socket.send('player ' + JSON.stringify(data));
    },
    next: function(hostname) {
        var data = {
            command: 'next',
            hostname: hostname
        };
        this.socket.send('player ' + JSON.stringify(data));
    },
    stop: function(hostname) {
        var data = {
            command: 'stop',
            hostname: hostname
        };
        this.socket.send('player ' + JSON.stringify(data));
    },
    seek: function(data) {
        data.command = 'seek';
        this.socket.send('player ' + JSON.stringify(data));
    },
    clear: function(hostname) {
        this.socket.send('player {"hostname":"' + hostname + '","command":"clear"}');
    },
    onoff: function(data) {
        var cmd = {
            hostname: data.hostname
        };
        if (data.isVlc === true) {
            cmd.command = 'vlc';
            if (data.state === 'true') {
                cmd.vlc = 'kill';
            } else {
                cmd.vlc = 'start';
            }
        } else {
            if (data.state === 'true') {
                cmd.command = 'shutdown';
            } else {
                cmd.command = 'wake';
            }
        }
        this.socket.send('pc ' + JSON.stringify(cmd));
    },
    removePlaylistItem: function(filename) {
        var cmd = {
            command: 'removePlaylistItem',
            filename: filename
        };
        this.socket.send('player ' + JSON.stringify(cmd));
    },
    updatePlaylistItem: function(data) {
        data.command = 'updatePlaylistItem';
        this.socket.send('player ' + JSON.stringify(data));
    },
    socketUrl: "ws://domotica.muysers.nl:8080",
    socket: undefined,
    socketMessage: function(evt) {
        var message, data;
        if ((evt.data.length > 0) && (evt.data !== "\r\n")) {
            evt.data = evt.data.replace(/(\r\n|\n|\r)/gm, "").trim();
            message = evt.data.split(" ")[0];
            data = evt.data.substr(evt.data.indexOf(' ') + 1);
            try {
                data = JSON.parse(data);
            } catch (error) {
                console.log("ERROR Player message: invalid json: " + data);
            }
        } else {
            console.log('ERROR Player message: invallid command: ' + evt.data);
        }
        this.publish(message, data);
    },
    socketConnect: function() {
        var that = this;
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = function(evt) {
            that.socket.send('init {"iodevice":"player"}');
            console.log('PLAYER SOCKET OPEN: ');
            console.log(evt);
            m.ui.status('player socket connected');
        };
        this.socket.onclose = function(evt) {
            console.log('PLAYER SOCKET CLOSE: ');
            console.log(evt);
        };
        this.socket.onmessage = function(evt) {
            that.socketMessage(evt);
        };
        this.socket.onerror = function(evt) {
            console.log('PLAYER SOCKET ERROR: ');
            console.log(evt);
        };
        this.socketTestInterval = setInterval(function() {
            if (that.socket.readyState === 3) {
                console.error('player socket down, reconecting...');
                m.ui.status('player socket down, reconecting...');
                that.socketConnect();
            }
        }, 2000);
    },
};
