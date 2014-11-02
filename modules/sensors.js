/*global Home */
var i,sns;
var list = require('../data/sensors.list.js'); 

for (i=0; i < list.length; i++){
    sns = list[i];
    if (sns.room !== undefined && sns.type !== undefined && sns.name !== undefined) { 
        if (Home[sns.room] === undefined){ Home[sns.room] = {}; }
        if (Home[sns.room][sns.type] === undefined){ Home[sns.room][sns.type] = {}; }
        Home[sns.room][sns.type][sns.name] = sns;
    }
}

module.exports = {
    list: list,
    save: function() {
        console.log('saving modules/sensors.list.js');
    }
};
