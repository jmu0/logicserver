/*jslint todo: true */
/*global Home */
var i,sns;
var list = require('../data/sensors.list.js'); 
var updateInterval = 2 * 1000;
if (Home.debug) { updateInterval = 20 * 1000; }
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
        Home.message.publish('requeststatus', {
            to: updateIODevices[i],
            from: "logic"
        });
    }
}, updateInterval);

Home.loader.on('ready',function(){
    Home.message.on('returnstatus', function(data){
        Home.sensors.update(data);
    });
});

module.exports = {
    list: list,
    save: function() {
        console.log('TODO: saving modules/sensors.list.js');
    },
    update: function(data) {
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i].iodevice === data.name) {
                this.list[i].set(data.status[this.list[i].iocontrol]);
                Home.message.publish('update', this.list[i]);
            }
        }
    }
};
