/*global Home */
module.exports = [
    {
        room: 'kamer',
        type: 'sensors',
        name: 'temperatuur',
        iodevice: 'arduino01',
        iocontrol: 'an4',
        ioconvert: 'tmp36',
        value: -1
    },
    {
        room: 'kamer',
        type: 'sensors',
        name: 'licht',
        iodevice: 'arduino01',
        iocontrol: 'an5',
        ioconvert: 'licht',
        value: -1
    }
];
