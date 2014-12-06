/*global alert, $, WebSocket */
var Home= {
    debug: false,
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
        if (Home.debug) { console.log("socketMessage: "+evt.data); }
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
        if (data.pc) {
            Home.pc = data.pc;
        }
        if (data.devices || data.events || data.sensors || data.pc) {
            Home.getDevices();
            Home.showDevices();
        }
        if (data.update) {
            if (data.update.hostname) {
                var btn = $('button.pcbutton[hostname="'+data.update.hostname+'"]');
                var vlcbtn = $('button.vlcbutton[hostname="'+data.update.hostname+'"]');
                if (data.update.alive) {
                    $(btn).html('Shutdown');
                    $(btn).attr('alive','true');
                    $(vlcbtn).removeAttr('disabled');
                } else {
                    $(btn).html('Wake');
                    $(btn).attr('alive','false');
                    $(vlcbtn).attr('disabled','disabled');
                }
                if (data.update.vlcAlive) {
                    $(vlcbtn).html('Kill vlc');
                    $(vlcbtn).attr('alive','true');
                } else {
                    $(vlcbtn).html('Start vlc');
                    $(vlcbtn).attr('alive','false');
                }
            } else {
                var n = $('[iodevice="' + data.update.iodevice + '"][iocontrol="'+data.update.iocontrol + '"]')[0];
                if (n) {
                    var nm = $(n).get(0).nodeName;
                    var type = $(n).attr('type');
                    var val, valIndex;
                    if (isNaN(parseInt(data.update.value,10))) {
                        val = data.update.values[data.update.values.indexOf(data.update.value)];
                    } else {
                        if (data.update.values){
                            val = data.update.values[data.update.values.indexOf(parseInt(data.update.value,10))];
                            valIndex = data.update.values.indexOf(val);
                        } else { 
                            val = data.update.value;
                        }
                    }
                    if (nm === 'INPUT') {
                        if (type === 'checkbox') {
                            if (valIndex === 0) {
                                n.checked = false;
                            } else {
                                n.checked = true;
                            }
                        } else if (type === 'range') {
                            $(n).val(valIndex);
                        } else {
                            $(n).val(val);
                        }
                    } else if (nm === 'SPAN'){
                        $(n).html(val);
                    }
                } else {
                    console.log('Not found: ' + data.update.iodevice + ", " + data.update.iocontrol);
                }
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
        for (i=0; i<Home.pc.length; i++){
            dev=Home.pc[i];
            if (Home.rooms[dev.room] === undefined) { Home.rooms[dev.room] = {}; }
            if (Home.rooms[dev.room][dev.type] === undefined) { Home.rooms[dev.room][dev.type] = {}; }
            Home.rooms[dev.room][dev.type][dev.hostname] = dev;
        }
    },
    showDevices: function() {
        var room, type, device, dev, val;
        var html = '<br><table><tbody>';
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
                                    html += "<td><span iocontrol='"+dev.iocontrol+ "' iodevice='"+dev.iodevice+"'>";
                                    html += "</span>";
                                    if (dev.name.indexOf('licht') > -1) { 
                                        html += " %"; 
                                    } else if (dev.name.indexOf('temp') > -1) {
                                        html += " &#176C";
                                    }
                                    html += "</td>";
                                    html += "</tr>";
                                } else if (dev.type === 'pc') {
                                    html += "<tr>";
                                    html += "<td>"+dev.hostname+"</td>";
                                    html += "<td>";
                                    html += "<button class='pcbutton' onclick='Home.pcOnOff(this)' hostname='" + dev.hostname + "' alive='"+dev.alive + "'>";
                                    if (dev.alive) { 
                                        html += "Shutdown</button> "; 
                                    } else {
                                        html += "Wake</button> "; 
                                    }
                                    html += "<button class='vlcbutton' onclick='Home.vlcOnOff(this)' hostname='" + dev.hostname + "' alive='"+dev.vlcAlive + "' ";
                                    if (dev.alive === false) { html += " disabled"; }
                                    if (dev.vlcAlive) { 
                                        html += ">Kill vlc</button> "; 
                                    } else {
                                        html += ">Start vlc</button> "; 
                                    }
                                    html += "</td>";
                                    html += "</tr>";
                                } else {
                                    html += "<tr>";
                                    html += "<td>"+dev.name+"</td>";
                                    if (dev.values.length === 2) {
                                        html += "<td><input type='checkbox' iodevice='"+dev.iodevice+"' iocontrol='"+dev.iocontrol+ "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += " values=" + JSON.stringify(dev.values) + " ";
                                        val = dev.values.indexOf(dev.value);
                                        if (isNaN(parseInt(dev.value,10)) === false && val === -1) { 
                                            val = dev.values.indexOf(parseInt(dev.value,10));
                                        }
                                        if (val > 0) { html += "checked "; }
                                        html += " /></td>";
                                    } else if (dev.values.length > 2) {
                                        html += "<td><input type='range' iodevice='"+dev.iodevice+"' iocontrol='"+dev.iocontrol+ "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += "value='";
                                        if (isNaN(parseInt(dev.value,10)) === true) {
                                            html += dev.values.indexOf(dev.value);
                                        } else {
                                            html += dev.values.indexOf(parseInt(dev.value,10));
                                        }
                                        html += "' values='" + JSON.stringify(dev.values) + "' ";
                                        html += "min=0 max=" + (dev.values.length - 1) + " />";
                                        html += "";
                                        html += "</td>";
                                    } else {
                                        html += "<td><input type='text' iodevice='"+dev.iodevice+"' iocontrol='"+dev.iocontrol+ "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += "value='"+dev.value+"'";
                                        html += " /></td>";
                                    }
                                    html += "</tr>";
                                }
                            }
                        }
                    }
                }
            }
        }
        $('div#devices').html(html);
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
    setcontrol: function(input) {
        var value= $(input).val();
        var values = $(input).attr('values');
        values = JSON.parse(values);
        var iodevice = $(input).attr('iodevice');
        var iocontrol = $(input).attr('iocontrol');
        var cmd = 'setcontrol ';
        switch ($(input).attr('type')) {
            case 'checkbox':
                if ($(input).is(':checked')) {
                    value = values[1];
                } else {
                    value = values[0];
                }
                break;
            case 'range':
                value  = values[value];
                break;
        }
        cmd += iodevice + " " + iocontrol + "=" + value;
        console.log(cmd);
        Home.socket.send(cmd);
    },
    resetControls: function() {
        var i,dev;
        for (i=0; i<Home.devices.length; i++) {
            dev=Home.devices[i];
            Home.setcontrol(dev.iodevice,dev.iocontrol,dev.value);
        }
    },
    pcOnOff: function(btn) {
        var hostname = $(btn).attr('hostname');
        var alive = $(btn).attr('alive');
        var cmd = "pc " + hostname;
        var vlcbtn = $('button.vlcbutton[hostname="'+hostname+'"]');
        if (alive === 'true') {
            cmd += " off";
            $(btn).html('Wake');
            $(btn).attr('alive','false');
            $(vlcbtn).attr('disabled','disabled');
        } else {
            cmd += " on";
            $(btn).html('Shutdown');
            $(btn).attr('alive','true');
            $(vlcbtn).removeAttr('disabled');
        }
        Home.socket.send(cmd);
    },
    vlcOnOff: function(btn) {
        var hostname = $(btn).attr('hostname');
        var alive = $(btn).attr('alive');
        var cmd = "pc " + hostname + " vlc ";
        if (alive === 'true') {
            cmd += "stop";
            $(btn).html('Start vlc');
            $(btn).attr('alive','false');
        } else {
            cmd += "start";
            $(btn).html('Kill vlc');
            $(btn).attr('alive','true');
        }
        Home.socket.send(cmd);
    }
};

