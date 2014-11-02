/*global Home */
var i,evt;
var list = require('../data/events.list.js'); 

for (i=0; i < list.length; i++){
    evt = list[i];
    if (evt.room !== undefined && evt.type !== undefined && evt.name !== undefined) { 
        if (Home[evt.room] === undefined){ Home[evt.room] = {}; }
        if (Home[evt.room][evt.type] === undefined){ Home[evt.room][evt.type] = {}; }
        Home[evt.room][evt.type][evt.name] = evt;
    }
}
module.exports = {
    list: list,
    save: function() {
        console.log('saving modules/events.list.js');
    }
};
