module.exports = [
{
    room: "kamer",
    type: "events",
    name: "test event",
    iodevice: "arduino02",
    iocontrol: 'di13',
    event: "di13 =0",
    action: function() {
        console.log("EVENT: PAAF! het ledje is uit!");
    }
},
{
    room: "kamer",
    type: "events",
    name: "beweging in de kamer",
    iodevice: "arduino02",
    iocontrol: "an5",
    event: "an5 >500",
    action: function() {
        console.log('EVENT: beweging in de kamer');
    }
}
];
