/*jslint todo:true */
/*global m, alert, $, WebSocket */
var Home = {
    debug: true,
    url: "http://domotica.muysers.nl",
    socketUrl: "ws://domotica.muysers.nl:8080",
    controls: undefined,
    rooms: {
        'keuken': {},
        'kamer': {}
    },
    init: function() {
        this.socketConnect();
    },
    socketConnect: function() {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = function(evt) {
            Home.socketOpen(evt);
        };
        this.socket.onclose = function(evt) {
            Home.socketClose(evt);
        };
        this.socket.onmessage = function(evt) {
            Home.socketMessage(evt);
        };
        this.socket.onerror = function(evt) {
            Home.socketError(evt);
        };
        this.socketTestInterval = setInterval(function() {
            if (Home.socket.readyState === 3) {
                console.error('socket down, reconecting...');
                m.ui.status('socket down, reconecting...');
                Home.socketConnect();
            }
        }, 2000);
    },
    socket: undefined,
    socketOpen: function(evt) {
        console.log("socketOpen " + JSON.stringify(evt));
        m.ui.status('websocket verbonden');
    },
    socketClose: function(evt) {
        console.log("socketClose " + JSON.stringify(evt));
    },
    socketMessage: function(evt) {
        var message, data;
        if (Home.debug) {
            console.log("socketMessage: " + evt.data);
        }
        if ((evt.data.length > 0) && (evt.data !== "\r\n")) {
            evt.data = evt.data.replace(/(\r\n|\n|\r)/gm, "").trim();
            message = evt.data.split(" ")[0];
            data = evt.data.substr(evt.data.indexOf(' ') + 1);
            try {
                data = JSON.parse(data);
            } catch (error) {
                console.log("ERROR: invalid json: " + data);
            }
        } else {
            console.log('ERROR: invallid command: ' + evt.data);
        }

        if (message === 'home') {
            Home.processHomeObject(data);
        } else if (message === 'update') {
            Home.update(data);
        }
    },
    processHomeObject: function(data) {
        if (data.controls) {
            Home.controls = data.controls;
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
        if (data.controls || data.events || data.sensors || data.pc) {
            Home.getcontrols();
            Home.showcontrols();
        }
        if (data.state) {
            Home.states = data.state;
            Home.showStates();
        }
    },
    update: function(data) {
        if (data.hostname) {
            var btn = $('button.pcbutton[hostname="' + data.hostname + '"]');
            var vlcbtn = $('button.vlcbutton[hostname="' + data.hostname + '"]');
            if (data.alive) {
                $(btn).html('Shutdown');
                $(btn).attr('alive', 'true');
                $(vlcbtn).removeAttr('disabled');
            } else {
                $(btn).html('Wake');
                $(btn).attr('alive', 'false');
                $(vlcbtn).attr('disabled', 'disabled');
            }
            if (data.vlcAlive) {
                $(vlcbtn).html('Kill vlc');
                $(vlcbtn).attr('alive', 'true');
            } else {
                $(vlcbtn).html('Start vlc');
                $(vlcbtn).attr('alive', 'false');
            }
        } else {
            var n = $('[iodevice="' + data.iodevice + '"][iocontrol="' + data.iocontrol + '"]')[0];
            if (n) {
                var nm = $(n).get(0).nodeName;
                var type = $(n).attr('type');
                var val, valIndex;
                if (isNaN(parseInt(data.value, 10))) {
                    valIndex = data.values.indexOf(data.value);
                    val = data.values[valIndex];
                } else {
                    if (data.values) {
                        val = data.values[data.values.indexOf(parseInt(data.value, 10))];
                        valIndex = data.values.indexOf(val);
                    } else {
                        val = data.value;
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
                } else if (nm === 'SPAN') {
                    $(n).html(val);
                }
            } else {
                console.log('Not found: ' + data.iodevice + ", " + data.iocontrol);
            }
        }
    },
    socketError: function(evt) {
        console.log("socketError " + JSON.stringify(evt));
    },
    getcontrols: function() {
        var i, dev;
        for (i = 0; i < Home.controls.length; i++) {
            dev = Home.controls[i];
            if (Home.rooms[dev.room] === undefined) {
                Home.rooms[dev.room] = {};
            }
            if (Home.rooms[dev.room][dev.type] === undefined) {
                Home.rooms[dev.room][dev.type] = {};
            }
            Home.rooms[dev.room][dev.type][dev.name] = dev;
        }
        if (Home.events) {
            for (i = 0; i < Home.events.length; i++) {
                dev = Home.events[i];
                if (Home.rooms[dev.room] === undefined) {
                    Home.rooms[dev.room] = {};
                }
                if (Home.rooms[dev.room][dev.type] === undefined) {
                    Home.rooms[dev.room][dev.type] = {};
                }
                Home.rooms[dev.room][dev.type][dev.name] = dev;
            }
        }
        for (i = 0; i < Home.sensors.length; i++) {
            dev = Home.sensors[i];
            if (Home.rooms[dev.room] === undefined) {
                Home.rooms[dev.room] = {};
            }
            if (Home.rooms[dev.room][dev.type] === undefined) {
                Home.rooms[dev.room][dev.type] = {};
            }
            Home.rooms[dev.room][dev.type][dev.name] = dev;
        }
        for (i = 0; i < Home.pc.length; i++) {
            dev = Home.pc[i];
            if (Home.rooms[dev.room] === undefined) {
                Home.rooms[dev.room] = {};
            }
            if (Home.rooms[dev.room][dev.type] === undefined) {
                Home.rooms[dev.room][dev.type] = {};
            }
            Home.rooms[dev.room][dev.type][dev.hostname] = dev;
        }
    },
    showcontrols: function() {
        var room, type, control, dev, val;
        var html = '<br><table><tbody>';
        for (room in Home.rooms) {
            if (Home.rooms.hasOwnProperty(room)) {
                html += "<tr><td class='kop1' colspan=2>" + room + "</td></tr>";
                for (type in Home.rooms[room]) {
                    if (Home.rooms[room].hasOwnProperty(type)) {
                        html += "<tr><td class='kop2' colspan=2>" + type + "</td></tr>";
                        for (control in Home.rooms[room][type]) {
                            if (Home.rooms[room][type].hasOwnProperty(control)) {
                                dev = Home.rooms[room][type][control];
                                if (dev.type === 'events') {
                                    html += "<tr>";
                                    html += "<td>" + dev.name + "</td>";
                                    html += "<td><span iodevice='" + dev.iodevice + "' iocontrol='" + dev.iocontrol + "'>" + dev.value;
                                    html += "</span></td>";
                                    html += "</tr>";
                                } else if (dev.type === 'sensors') {
                                    html += "<tr>";
                                    html += "<td>" + dev.name + "</td>";
                                    html += "<td><span iocontrol='" + dev.iocontrol + "' iodevice='" + dev.iodevice + "'>";
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
                                    html += "<td>" + dev.hostname + "</td>";
                                    html += "<td>";
                                    html += "<button class='pcbutton' onclick='Home.pcOnOff(this)' hostname='" + dev.hostname + "' alive='" + dev.alive + "'>";
                                    if (dev.alive) {
                                        html += "Shutdown</button> ";
                                    } else {
                                        html += "Wake</button> ";
                                    }
                                    html += "<button class='vlcbutton' onclick='Home.vlcOnOff(this)' hostname='" + dev.hostname + "' alive='" + dev.vlcAlive + "' ";
                                    if (dev.alive === false) {
                                        html += " disabled";
                                    }
                                    if (dev.vlcAlive) {
                                        html += ">Kill vlc</button> ";
                                    } else {
                                        html += ">Start vlc</button> ";
                                    }
                                    html += "</td>";
                                    html += "</tr>";
                                } else {
                                    html += "<tr>";
                                    html += "<td>" + dev.name + "</td>";
                                    if (dev.values.length === 2) {
                                        html += "<td><input type='checkbox' iodevice='" + dev.iodevice + "' iocontrol='" + dev.iocontrol + "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += " values=" + JSON.stringify(dev.values) + " ";
                                        val = dev.values.indexOf(dev.value);
                                        if (isNaN(parseInt(dev.value, 10)) === false && val === -1) {
                                            val = dev.values.indexOf(parseInt(dev.value, 10));
                                        }
                                        if (val > 0) {
                                            html += "checked ";
                                        }
                                        html += " /></td>";
                                    } else if (dev.values.length > 2) {
                                        html += "<td><input type='range' iodevice='" + dev.iodevice + "' iocontrol='" + dev.iocontrol + "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += "value='";
                                        if (isNaN(parseInt(dev.value, 10)) === true) {
                                            html += dev.values.indexOf(dev.value);
                                        } else {
                                            html += dev.values.indexOf(parseInt(dev.value, 10));
                                        }
                                        html += "' values='" + JSON.stringify(dev.values) + "' ";
                                        html += "min=0 max=" + (dev.values.length - 1) + " />";
                                        html += "";
                                        html += "</td>";
                                    } else {
                                        html += "<td><input type='text' iodevice='" + dev.iodevice + "' iocontrol='" + dev.iocontrol + "' ";
                                        html += "onchange=\"Home.setcontrol(this)\" ";
                                        html += "value='" + dev.value + "'";
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
        $('div#controls').html(html);
    },
    showStates: function() {
        var html = '<table class="striped" width="100%"><tbody>';
        var state;
        for (state in Home.states) {
            if (Home.states.hasOwnProperty(state)) {
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
        Home.socket.send('setstate {"state":"' + state + '"}');
    },
    setcontrol: function(input) {
        var value = $(input).val();
        var values = $(input).attr('values');
        values = JSON.parse(values);
        var cmd = {};
        cmd.iodevice = $(input).attr('iodevice');
        cmd.iocontrol = $(input).attr('iocontrol');
        switch ($(input).attr('type')) {
            case 'checkbox':
                if ($(input).is(':checked')) {
                    value = values[1];
                } else {
                    value = values[0];
                }
                break;
            case 'range':
                value = values[value];
                break;
        }
        cmd.value = value;
        if (Home.debug) {
            console.log(cmd);
        }
        Home.socket.send('setcontrol ' + JSON.stringify(cmd));
    },
    resetControls: function() {
        var i, dev;
        for (i = 0; i < Home.controls.length; i++) {
            dev = Home.controls[i];
            Home.setcontrol(dev.iodevice, dev.iocontrol, dev.value);
        }
    },
    pcOnOff: function(btn) {
        var cmd = {};
        cmd.hostname = $(btn).attr('hostname');
        var alive = $(btn).attr('alive');
        var vlcbtn = $('button.vlcbutton[hostname="' + cmd.hostname + '"]');
        if (alive === 'true') {
            cmd.command = "shutdown";
            $(btn).html('Shutting down...');
            $(btn).attr('alive', 'false');
            $(vlcbtn).attr('disabled', 'disabled');
        } else {
            cmd.command = "wake";
            $(btn).html('Waking...');
            $(btn).attr('alive', 'true');
            $(vlcbtn).removeAttr('disabled');
        }
        Home.socket.send('pc ' + JSON.stringify(cmd));
    },
    vlcOnOff: function(btn) {
        var cmd = {};
        cmd.hostname = $(btn).attr('hostname');
        cmd.command = 'vlc';
        var alive = $(btn).attr('alive');
        if (alive === 'true') {
            cmd.vlc = "kill";
            $(btn).html('Start vlc');
            $(btn).attr('alive', 'false');
        } else {
            cmd.vlc = "start";
            $(btn).html('Kill vlc');
            $(btn).attr('alive', 'true');
        }
        Home.socket.send('pc ' + JSON.stringify(cmd));
    }
};
