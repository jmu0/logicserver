/*global Home */
module.exports = [
    {
        room: 'kamer',
        type: 'sensors',
        name: 'temperatuur',
        iodevice: 'arduino01',
        iocontrol: 'an4',
        set: function(value) {
            var refVoltage = 4750.0;
            this.raw = value;
            var voltage = (value * (refVoltage / 1024.0));
            this.value = Math.round((voltage - 500.0) / 10.0);
        },
        value: undefined,
        raw: undefined
    },
    {
        room: 'kamer',
        type: 'sensors',
        name: 'licht',
        iodevice: 'arduino01',
        iocontrol: 'an5',
        set: function(value) {
            var min = 0;
            var max = 1024;
            this.raw = value;
            this.value = Math.round((value / (max - min)) * 100);
        },
        value: undefined,
        raw: undefined
    }
];
