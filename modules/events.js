/*jslint todo: true */
/*global Home */
//TODO: Vervangen door message???
var i, evt;
var list = require('../data/events.list.js');

function event(e) {
    if (e.room) {
        this.room = e.room;
    }
    if (e.type) {
        this.type = e.type;
    }
    if (e.name) {
        this.name = e.name;
    }
    if (e.iodevice) {
        this.iodevice = e.iodevice;
    }
    if (e.ioevent) {
        this.ioevent = e.ioevent;
    }
    this.handlers = [];
}
event.prototype = {
    room: undefined,
    type: undefined,
    name: undefined,
    iodevice: undefined,
    ioevent: undefined,
    trigger: function() {
        /** trigger all event handlers */
        if (Home.debug) {
            console.log("triggering event:"); console.log(this);
        }
        for (i = 0; i < this.handlers.length; i++) {
            if (Home.debug) { console.log("handler "+i);}
            this.handlers[i]();
        }
    },
    addHandler: function(fn) {
        /** add event handler */
        this.handlers.push(fn);
        if (Home.debug) {
            console.log('adding handler to:');
            console.log(this);
            console.log(this.handlers.length + ' handlers');
        }
    }
};

for (i = 0; i < list.length; i++) {
    list[i] = new event(list[i]);
    evt = list[i];
    if (evt.room !== undefined && evt.type !== undefined && evt.name !== undefined) {
        if (Home[evt.room] === undefined) {
            Home[evt.room] = {};
        }
        if (Home[evt.room][evt.type] === undefined) {
            Home[evt.room][evt.type] = {};
        }
        Home[evt.room][evt.type][evt.name] = evt;
    }
}

Home.loader.on('ready', function() {
    Home.message.on('event', function(data) {
        if (Home.debug) { console.log("checking event:"); console.log(data);}
        Home.events.list.forEach(function(event) {
            if (Home.debug) { console.log(event);}
            if (data.iodevice === event.iodevice && data.ioevent === event.ioevent) {
                if (Home.debug) {
                    console.log('found:');
                    console.log(event);
                }
                event.trigger();
            }
        });
    });
});

module.exports = {
    list: list,
    event: event,
    save: function() {
        /** saves event list to file */
        //TODO: save event list to file?
        console.log('saving data/events.list.js');
    },
    findByDevice: function(iodevice, ioevent) {
        /** finds event by device */
        var ret;
        for (i = 0; i < this.list.length; i++) {
            if ((this.list[i].iodevice === iodevice) && (this.list[i].ioevent === ioevent)) {
                ret = this.list[i];
            }
        }
        return ret;
    },
    findByName: function(name) {
        /** finds event by name */
        var ret;
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i].name === name) {
                // console.log('findByName: '+this.list[i].name +" = " +name);
                ret = this.list[i];
            }
        }
        return ret;
    },
    trigger: function(evt) {
        //TODO: trigger by message
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
            if (Home.debug) {
                console.log('Event trigger:');
                console.log(event);
            }
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
