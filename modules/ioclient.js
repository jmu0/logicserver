/*jslint todo: true */
/*global Home */
var clientname = 'logic';
var net = require('net');
var server;
var servername = 'domotica';
var serverport = 9999;
var checkinterval;

function doCommand(cmd) {
    var message, data;
    if ((cmd.length > 0) && (cmd!== "\r\n")){
        cmd = cmd.replace(/(\r\n|\n|\r)/gm,"").trim();
        message = cmd.split(" ")[0];
        data = cmd.substr(cmd.indexOf(' ') + 1);
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log("ERROR: invalid json: "+data);
        }
    } else {
        console.log('ERROR: invallid command: ' + cmd);
    }
    Home.message.publish(message, data);

    //DONE: returnstatus sensors
    //DONE: returnstatus controls 
    //DONE: updatecontrol
    //DONE: event
    //DONE: setstate
    //TODO: setcontrol
    //DONE: implement messages from websocket
    //TODO: implement messages to websocket
    //TODO: pc
    //TODO: pong
}

//TODO: init: set iocontrols on iodevice based on stored values

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
    console.log("Server ERROR: " + error);
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

Home.loader.on('ready',function(){
    Home.message.on('setcontrol', function(data){
        Home.ioclient.write('setcontrol ' + JSON.stringify(data));
    });
});


module.exports = {
    write: function(data) {
        //DEBUG: if (Home.debug) { console.log('ioclient:' + data); }
        if (data.substr(data.length -1) !== "\n") { data += "\n"; }
        server.write(data);
    }
};
connectServer();
