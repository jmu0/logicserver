/*jslint todo: true */
/*global Home */
var clientname = 'logic';
var net = require('net');
var server;
var servername = 'domotica';
var serverport = 9999;
var checkinterval;

function doCommand(command) {
    var events, recevent, device, i;
    var iodevice,iocontrol,value;
    console.log("ioclient: " + command);
    command = command.split(' ');
    if (command.length > 1) {
        iodevice = command[1];
        if (iodevice === 'pc') {
            if (command[2]){
                device = Home.pc.find(command[2]);
                if (device) {
                    if (command[3]) {
                        if (command[3] === 'vlc' && command[4] !== undefined) {
                            device.pongVlc(command[4]);
                        } else {
                            device.pong(command[3]);
                        }
                    }
                }
            }
        } else {
            if (command[2]) {
                iocontrol = command[2].split('=')[0];
                value = command[2].split('=')[1];
                device = Home.devices.find({
                    iodevice: iodevice,
                    iocontrol: iocontrol
                });
            }
        }
        if (device !== undefined) {
            if (command[0] === 'init') {
                console.log('initialiseren: ' + iodevice);
                //TODO: device betekende eerst bv. arduino01
                /*
                if (device.hasOwnProperty('init') === true){
                    device.init();
                }
                */
            } else if (command[0] === 'update') {
                device.value = value;
                var obj = {
                    update: device
                };
                Home.ui.websocket.broadcast(JSON.stringify(obj));
                if (iodevice !== 'pc') {
                    Home.devices.save();
                }
            } else if (command[0] === 'event') {
                events = device.events();
                recevent = command[2]+" "+command[3];
                for (i=0; i < events.length; i++) {
                    
                    if (events[i].event === recevent) {
                        events[i].action();
                        break;
                    }
                }
            }
        } else {
            console.log("device: '"+command[1] + "' unknown");
        }
    }
}

function serverData(data) {
    data += "";
    var commands = data.split("\n");
    var i;
    for (i = 0; i < commands.length; i++) {
        if (commands[i].length > 0) {
            doCommand(commands[i]);
        }
    }
}

function serverError(error) {
    console.log("ERROR: " + error);
}

function connectServer() {
    server = new net.Socket();
    server.connect(serverport, servername, function(){
        console.log("Connected to ioserver: " + servername + ":" + serverport);
        server.write('init ' + clientname + "\n");
    });
    server.on('data', serverData);
    server.on('error', serverError);
    if (checkinterval !== undefined) {
        clearInterval(checkinterval);
    }
    checkinterval = setInterval(function(){
        if (server.writable === false) {
            connectServer();
        }
    }, 2000);
}



module.exports = {
    write: function(data) {
        console.log('ioclient:' + data);
        if (data.substr(data.length -1) !== "\n") { data += "\n"; }
        server.write(data);
    }
};
connectServer();
