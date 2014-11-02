/*global alert, $, WebSocket */
var Home= {
    url: "http://domotica.muysers.nl",
    socketUrl: "ws://domotica.muysers.nl:8080",
    devices: undefined,
    rooms: {
        'keuken': {},
        'kamer': {}
    },
    init: function() {
        /* OUD
           $.get('devices', function(data) {
           Home.devices = JSON.parse(data);
           Home.showDevices();
           });
           */
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = function(evt) { Home.socketOpen(evt); };
        this.socket.onclose = function(evt) { Home.socketClose(evt); };
        this.socket.onmessage = function(evt) { Home.socketMessage(evt); };
        this.socket.onerror = function(evt) { Home.socketError(evt); };
    },
    socket: undefined,
    socketOpen: function(evt){
        console.log("socketOpen "+JSON.stringify(evt));
    },
    socketClose: function(evt){
        console.log("socketClose "+JSON.stringify(evt));
    },
    socketMessage: function(evt){
        console.log("socketMessage: "+evt.data);
        var data = JSON.parse(evt.data);
        if (data.devices) {
            Home.devices = data.devices;
        }
        if (data.events) {
            Home.events = data.events;
        }
        if (data.sensors) {
            Home.sensors = data.sensors;
        }
        if (data.devices || data.events || data.sensors) {
            Home.getDevices();
            Home.showDevices();
        }
        if (data.update) {
            console.log('update: ' + JSON.stringify(data));
            var n = $('[iodevice="' + data.update.iodevice + '"][iocontrol="'+data.update.iocontrol + '"]')[0];
            var nm = $(n).get(0).nodeName;
            if (nm === 'INPUT') {
                $(n).val(data.update.value);
            } else if (n==='SPAN'){
                $(n).html(data.update.value);
            }
        }
        if (data.state) {
            Home.states = data.state;
            Home.showStates();
        }
    },
    socketError: function(evt){
        console.log("socketError "+JSON.stringify(evt));
    },
    getDevices: function() {
        var i,dev;
        for (i=0; i<Home.devices.length; i++){
            dev=Home.devices[i];
            if (Home.rooms[dev.room] === undefined) { Home.rooms[dev.room] = {}; }
            if (Home.rooms[dev.room][dev.type] === undefined) { Home.rooms[dev.room][dev.type] = {}; }
            Home.rooms[dev.room][dev.type][dev.name] = dev;
        }
        for (i=0; i<Home.events.length; i++){
            dev=Home.events[i];
            if (Home.rooms[dev.room] === undefined) { Home.rooms[dev.room] = {}; }
            if (Home.rooms[dev.room][dev.type] === undefined) { Home.rooms[dev.room][dev.type] = {}; }
            Home.rooms[dev.room][dev.type][dev.name] = dev;
        }
        for (i=0; i<Home.sensors.length; i++){
            dev=Home.sensors[i];
            if (Home.rooms[dev.room] === undefined) { Home.rooms[dev.room] = {}; }
            if (Home.rooms[dev.room][dev.type] === undefined) { Home.rooms[dev.room][dev.type] = {}; }
            Home.rooms[dev.room][dev.type][dev.name] = dev;
        }
    },
    showDevices: function() {
        var html = "";
        var room;
        var type;
        var device; 
        var dev;
        html = '<br><table><tbody>';
        for (room in Home.rooms) {
            if (Home.rooms.hasOwnProperty(room)) {
                html += "<tr><td class='kop1' colspan=2>"+room+"</td></tr>";
                for(type in Home.rooms[room]) {
                    if (Home.rooms[room].hasOwnProperty(type)){
                        html += "<tr><td class='kop2' colspan=2>" + type + "</td></tr>";
                        for(device in Home.rooms[room][type]){
                            if (Home.rooms[room][type].hasOwnProperty(device)){
                                dev = Home.rooms[room][type][device];
                                if (dev.type === 'events') {
                                    html += "<tr>";
                                    html += "<td>"+dev.name+"</td>";
                                    html += "<td><span iodevice='" + dev.iodevice + "' iocontrol='"+dev.iocontrol +"'>" + dev.value;
                                    html += "</span></td>";
                                    html += "</tr>";
                                } else if (dev.type === 'sensors') {
                                    html += "<tr>";
                                    html += "<td>"+dev.name+"</td>";
                                    html += "<td><span iodevice='" + dev.iodevice + "' iocontrol='"+dev.iocontrol +"'>" + dev.value;
                                    html += "</span></td>";
                                    html += "</tr>";
                                } else {
                                    html += "<tr>";
                                    html += "<td>"+dev.name+"</td>";
                                    html += "<td><input class='text' iodevice='"+dev.iodevice+"' iocontrol='"+dev.iocontrol+ "' ";
                                    html += "onchange=\"Home.setcontrol('"+dev.iodevice+"','"+dev.iocontrol+"',this.value)\" ";
                                    html += "value='"+dev.value+"'";
                                    html += " /></td>";
                                    html += "</tr>";
                                }
                            }
                        }
                    }
                }
            }
        }
        $('div#apparaten').html(html);
    },
    showStates: function() {
        var html = '<table class="striped" width="100%"><tbody>';
        var state; 
        for(state in Home.states) {
            if (Home.states.hasOwnProperty(state)){
                html += "<tr>";
                html += "<td>" + Home.states[state] + "</td>";
                html += "<td><button onclick='Home.setstate(\"" + Home.states[state] + "\")'>Apply</button></td>";
                html += "</tr>";
            }
        }
        html += "</tbody></table>";
        $('div#state').html(html);
    },
    setstate: function(state) {
        Home.socket.send('state ' + state);
    },
    setcontrol: function(iodevice, iocontrol, value) {
        Home.socket.send('setcontrol ' + iodevice + " " + iocontrol + "=" + value);
    },
    resetControls: function() {
        var i,dev;
        for (i=0; i<Home.devices.length; i++) {
            dev=Home.devices[i];
            Home.setcontrol(dev.iodevice,dev.iocontrol,dev.value);
        }
    }
};

