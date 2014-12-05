/*global Home */
var i,sns;
var list = require('../data/sensors.list.js'); 
var updateInterval = 2000;
var updateIODevices = [];

for (i=0; i < list.length; i++){
    sns = list[i];
    if (sns.room !== undefined && sns.type !== undefined && sns.name !== undefined) { 
        if (Home[sns.room] === undefined){ Home[sns.room] = {}; }
        if (Home[sns.room][sns.type] === undefined){ Home[sns.room][sns.type] = {}; }
        Home[sns.room][sns.type][sns.name] = sns;
        if (updateIODevices.indexOf(sns.iodevice) === -1) {
            updateIODevices.push(sns.iodevice);
        }
    }
}

setInterval(function(){
    for(i=0; i<updateIODevices.length; i++) {
        Home.ioclient.write('requeststatus ' + updateIODevices[i] + ' logic');
    }
}, updateInterval);

module.exports = {
    list: list,
    save: function() {
        console.log('TODO: saving modules/sensors.list.js');
    },
    update: function(data) {
        if (Home.debug) { console.log('Home.sensors.update: ' + data); }
        var obj = JSON.parse(data);
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i].iodevice === obj.name) {
                this.list[i].set(obj.status[this.list[i].iocontrol]);
                if (Home.debug) { console.log(this.list[i].name + " = " + this.list[i].value + " (" + this.list[i].raw + ")"); }
                Home.ui.websocket.broadcast(JSON.stringify({
                    update: this.list[i]
                }));
            }
        }
    }
};
