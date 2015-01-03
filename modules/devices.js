/*jslint todo: true */
/*global Home */
var i,dev;
var list = require('../data/devices.list.js'); 
var fs = require('fs');

for (i=0; i < list.length; i++){
    dev = list[i];
    if (dev.room !== undefined && dev.type !== undefined && dev.name !== undefined) { 
        if (Home[dev.room] === undefined){ Home[dev.room] = {}; }
        if (Home[dev.room][dev.type] === undefined){ Home[dev.room][dev.type] = {}; }
        Home[dev.room][dev.type][dev.name] = dev;
    }
}

Home.loader.on('ready', function(){
    Home.message.on('updatedevice', function(data) {
        //TODO: devices: handle update message
        if (Home.debug) { console.log('DEVICES update: '); console.log(data); }
    });
    Home.message.on('returnstatus', function(data){ 
        //TODO: devices: handle returnstatus message
        if (Home.debug) { console.log('DEVICES returnstatus: '); console.log(data); }
        Home.devices.list.forEach(function(device) {
            if (device.iodevice === data.name && data.status[device.iocontrol]) {
                if (device.value !== data.status[device.iocontrol]) {
                    console.log('UPDATING:'); console.log(device);
                    device.value = data.status[device.iocontrol];
                    Home.message.publish('update', device);
                }
            }
        });
    });
});

module.exports = {
    list: list,
    save: function() {
        clearTimeout(this.t);
        this.t = setTimeout(function() {
            var filename = Home.rootpath+'data/devices.list.js';
            var file = "module.exports = " + JSON.stringify(Home.devices.list) + ";";
            fs.writeFile(filename, file, function(error) {
                if (error) {
                    console.log("ERROR writing file: " + filename + ": " + JSON.stringify(error));
                } else {
                    console.log('saved file: ' + filename);
                }
            });
        }, 5000);
    },
    update: function(device) {
        //TODO: handle update
        if (Home.debug) { console.log('devices updating: ' + device.iodevice + ' ' + device.iocontrol + " = " + device.value); }
    },
    setControl: function(control, value) {
        //TODO: ipmlement message
        Home.ioclient.write('setcontrol ' + control.iodevice + " " + control.iocontrol+"="+ value);
    },
    find: function(dev) {
        var ret,found,j;
        for(i=0; i<Home.devices.list.length; i++){
            found=false;
            for (j in dev){
                if (dev.hasOwnProperty(j)) {
                    //console.log(Home.devices.list[i][j] + " = " + dev[j]);
                    if (String(Home.devices.list[i][j]) === String(dev[j])){
                        found=true;
                    } else {
                        found=false;
                    }
                    //console.log(found);
                }
            }
            if (found) { ret = Home.devices.list[i]; }
        }
        return ret;
    }
};
