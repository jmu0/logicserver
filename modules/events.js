/*jslint todo: true */
/*global Home */
var i,evt;
var list = require('../data/events.list.js'); 

function event(e) {
    if (e.room) { this.room = e.room; }
    if (e.type) { this.type = e.type; }
    if (e.name) { this.name = e.name; }
    if (e.iodevice) { this.iodevice = e.iodevice; }
    if (e.ioevent) { this.ioevent = e.ioevent; }
}
event.prototype = {
    room: undefined,
    type: undefined,
    name: undefined,
    iodevice: undefined,
    ioevent: undefined,
    handlers: [],
    trigger: function(){
        /** trigger all event handlers */
        for (i=0; i<this.handlers.length; i++) {
            this.handlers[i]();
        }
    },
    addHandler: function(fn) {
        /** add event handler */
        this.handlers.push(fn);
    }
};

for (i=0; i < list.length; i++){
    list[i] = new event(list[i]);
    evt = list[i];
    if (evt.room !== undefined && evt.type !== undefined && evt.name !== undefined) { 
        if (Home[evt.room] === undefined){ Home[evt.room] = {}; }
        if (Home[evt.room][evt.type] === undefined){ Home[evt.room][evt.type] = {}; }
        Home[evt.room][evt.type][evt.name] = evt;
    }
}

module.exports = {
    list: list,
    event: event,
    save: function() {
        /** saves event list to file */
        //TODO: save event list to file?
        console.log('saving modules/events.list.js');
    },
    findByDevice: function(iodevice, ioevent) {
        /** finds event by device */
        var ret;
        for (i=0; i < this.list.length; i++) {
            if ((this.list[i].iodevice === iodevice) && (this.list[i].ioevent === ioevent)) { 
                    ret = this.list[i];
            }
        }
        return ret;
    },
    findByName: function(name) {
        /** finds event by name */
        var ret;
        for (i=0; i < this.list.length; i++) {
            if (this.list[i].name === name) { 
                    ret = this.list[i];
            }
        }
        return ret;
    },
    trigger: function(evt) {
        /** triggers event
         *  if event is object: find by device, else find by name
         *  call trigger function
         */
        var event;
        if (evt.iodevice && evt.ioevent) {
            event = this.findByDevice(evt.iodevice, evt.ioevent);
        } else {
            event = this.findByName(evt);
        }
        if (event !== undefined) {
            if (Home.debug) { console.log('Event trigger:'); console.log(event); }
            event.trigger();
        } else {
            if (Home.debug) { 
                console.log('Event not found:'); 
                console.log(evt); 
            }
        }
    },
    on: function(name, callback) {
        var event = this.findByName(name);
        if (event) {
            event.addHandler(callback);
        } else {
            console.log('Addhandler: event ' + name + ' not found.');
        }
    }
};
