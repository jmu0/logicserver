var WebSocketServer = require('ws').Server;
var socket = new WebSocketServer({port: 8080});
console.log('websocket listening on port 8080');

socket.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('websocket received: %s', message);
        socket.broadcast(message);
    });
    console.log('websocket connected: '+ ws._socket.remoteAddress);
});

socket.broadcast = function(data) {
    var i;
    for(i in this.clients) {
        if (this.clients.hasOwnProperty(i)){
            this.clients[i].send(data);
        }
    }
};
