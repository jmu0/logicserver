function getEventsForDevice(device) {
    var i;
    var ev = [];
    for (i = 0; i < Home.events.length; i++) {
        if (Home.events[i].device === device) {
            ev.push(Home.events[i]);
        }
    }
    return ev;
}

function setDefaults(device) {
    var i;
    var reg;
    var dev = module.exports[device];
    var ev = dev.events();
    console.log("setting defaults on " + device + ":");
    for (i = 0; i < dev.controls.length; i++) {
        if (dev.controls[i].default !== undefined) {
            reg = "setcontrol " + device + " " + dev.controls[i].name +"="+dev.controls[i].default+"\n";
            Home.ioclient.write(reg);
        }
    }
    //Home.ioclient.write("resetevents " + device + "\n");
    //TODO: resetevents command aan firmware toevoegen
    for (i=0; i < ev.length; i++) {
        reg = "setevent " + device + " " + ev[i].event + "\n";
        Home.ioclient.write(reg);
    }
}

module.exports = {
    arduino01: {
        init: function() {
            setDefaults('arduino01');
        },
        controls: [
            //TODO: value in een functie veranderen (get/set)
            {name: 'di0', default: undefined, value: undefined },
            {name: 'di1', default: undefined, value: undefined },
            {name: 'di2', default: 1, value: undefined },
            {name: 'di3', default: 1, value: undefined },
            {name: 'di4', default: 1, value: undefined },
            {name: 'di5', default: undefined, value: undefined },
            {name: 'di6', default: undefined, value: undefined },
            {name: 'di7', default: undefined, value: undefined },
            {name: 'di8', default: undefined, value: undefined },
            {name: 'di9', default: undefined, value: undefined },
            {name: 'di10', default: undefined, value: undefined },
            {name: 'di11', default: undefined, value: undefined },
            {name: 'di12', default: undefined, value: undefined },
            {name: 'di13', default: undefined, value: undefined }
        ],
        sensors: [
            {name: 'an0', value: undefined },
            {name: 'an1', value: undefined },
            {name: 'an2', value: undefined },
            {name: 'an3', value: undefined },
            {name: 'an4', value: undefined }
        ],
        events: function() {
            return getEventsForDevice('arduino01');
        },
        update: function(status) {
            //TODO: request/set de status van controls/sensors
        }
    },
    arduino02: {
        init: function() {
            setDefaults('arduino02');
        },
        controls: [
            {name: 'di0', default: undefined, value: undefined },
            {name: 'di1', default: undefined, value: undefined },
            {name: 'di2', default: 1, value: undefined },
            {name: 'di3', default: 1, value: undefined },
            {name: 'di4', default: 1, value: undefined },
            {name: 'di5', default: 1, value: undefined },
            {name: 'di6', default: 1, value: undefined },
            {name: 'di7', default: 1, value: undefined },
            {name: 'di8', default: undefined, value: undefined },
            {name: 'di9', default: undefined, value: undefined },
            {name: 'di10', default: undefined, value: undefined },
            {name: 'di11', default: undefined, value: undefined },
            {name: 'di12', default: undefined, value: undefined },
            {name: 'di13', default: 1, value: undefined }
        ],
        sensors: [
            {name: 'an0', value: undefined },
            {name: 'an1', value: undefined },
            {name: 'an2', value: undefined },
            {name: 'an3', value: undefined },
            {name: 'an4', value: undefined },
        ],
        events: function() {
            return getEventsForDevice('arduino02');
        }
    }
};
