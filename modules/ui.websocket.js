/*jslint todo: true */
/*global Home */
var WebSocketServer = require('ws').Server;
var socket = new WebSocketServer({port: 8080});
//var util = require('util');
console.log('websocket listening on port 8080');

function sendHomeObject(ws) {
    var obj = {
        "controls": Home.controls.list,
        "events": Home.events.list,
        "sensors": Home.sensors.list,
        "state": Home.state.getList(),
        "pc": Home.pc.list
    };
    ws.send(JSON.stringify(obj));
    //ws.send(util.inspect(obj, { depth: null }));
}

function doCommand(cmd) {
    var message, data;
    if ((cmd.length > 0) && (cmd!== "\r\n")){
        cmd = cmd.replace(/(\r\n|\n|\r)/gm,"").trim();
        message = cmd.split(" ")[0];
        data = cmd.substr(cmd.indexOf(' ') + 1);
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log("ERROR websocket doCommand: invalid json: "+data);
        }
    } else {
        console.log('ERROR websocket doCommand: invallid command: ' + cmd);
    }
    Home.message.publish(message, data);
    
    /*
    var splitCommand = command.split(" ");
    switch (splitCommand[0]){
        case 'setcontrol': 
            Home.ioclient.write(command);
        break;
        case 'state':
            Home.state[splitCommand[1]]();
            break;
        case 'pc':
            Home.pc.doCommand(command);
            break;
        default: 
            console.log('unknown command: ' + command);
    }
    */
}

socket.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('websocket received: %s', message);
        doCommand(message);
    });
    console.log('websocket connected: '+ ws._socket.remoteAddress);
    sendHomeObject(ws);
});

Home.loader.on('ready', function(){
    Home.message.on('update', function(data){
        //TODO: implement messages in websocket communication
        Home.ui.websocket.broadcast(JSON.stringify({
            update: data
        }));
    });
});

module.exports = {
    socket: socket,
    broadcast: function(data) {
        var i;
        //DEBUG if (Home.debug) { console.log('websocket broadcasting: ' + data); }
        for(i in this.socket.clients) {
            if (this.socket.clients.hasOwnProperty(i)){
                if (Home.debug) { console.log('broadcast to: '+ this.socket.clients[i]._socket.remoteAddress); }
                this.socket.clients[i].send(data);
            }
        }

    }
};
