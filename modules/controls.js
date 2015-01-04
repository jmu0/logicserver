/*jslint todo: true */
/*global Home */
var i,dev;
var list = require('../data/controls.list.js'); 
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
    Home.message.on('updatecontrol', Home.controls.updatecontrol);
    Home.message.on('returnstatus', Home.controls.returnstatus);
});

module.exports = {
    list: list,
    updatecontrol: function(data){
        if (Home.debug) { console.log('UPDATECONTROLS controls.js: '); console.log(data); }
        var control = Home.controls.findByIO(data);
        if (control) {
            if (control.value !== data.value){
                control.value = data.value;
                Home.controls.save();
                Home.message.publish('update', control);
            }
        } else {
            if (Home.debug) { console.log("updatecontrols: control not found"); }
        }
    },
    returnstatus: function(data){
        var changed = false; 
        if (Home.debug) { console.log('CONTROLS returnstatus: '); console.log(data); }
        Home.controls.list.forEach(function(control) {
            if (control.iodevice === data.name && data.status[control.iocontrol]) {
                if (control.value !== data.status[control.iocontrol]) {
                    console.log('UPDATING:'); console.log(control);
                    control.value = data.status[control.iocontrol];
                    changed = true;
                    Home.message.publish('update', control);
                }
            }
        });
        if (changed) { Home.controls.save(); }
    },
    save: function() {
        clearTimeout(this.t);
        this.t = setTimeout(function() {
            var filename = Home.rootpath+'data/controls.list.js';
            var file = "module.exports = " + JSON.stringify(Home.controls.list) + ";";
            fs.writeFile(filename, file, function(error) {
                if (error) {
                    console.log("ERROR writing file: " + filename + ": " + JSON.stringify(error));
                } else {
                    console.log('saved file: ' + filename);
                }
            });
        }, 5000);
    },
    setControl: function(control, value) {
        //TODO: ipmlement message
        Home.ioclient.write('setcontrol ' + control.iodevice + " " + control.iocontrol+"="+ value);
    },
    findByIO: function(data) {
        var ret;
        Home.controls.list.forEach(function(control){
            if (control.iodevice === data.iodevice && String(control.iocontrol) === data.iocontrol) {
                ret = control;
            }
        });
        return ret;
    },
    find: function(dev) {
        var ret,found,j;
        for(i=0; i<Home.controls.list.length; i++){
            found=false;
            for (j in dev){
                if (dev.hasOwnProperty(j)) {
                    //console.log(Home.controls.list[i][j] + " = " + dev[j]);
                    if (String(Home.controls.list[i][j]) === String(dev[j])){
                        found=true;
                    } else {
                        found=false;
                    }
                    //console.log(found);
                }
            }
            if (found) { ret = Home.controls.list[i]; }
        }
        return ret;
    }
};
