/*jslint todo: true */
module.exports = [
{
    room: "kamer",
    type: "events",
    name: "test event",
    iodevice: "kaku",
    event: "0x7B6E08A=On",
    action: function() {
        //TODO: replace 'action' with 'trigger' 
        //TODO: use 'on' function to set multiple handlers
        console.log("PAAF!");
    }
},
{
    room: "kamer",
    type: "events",
    name: "beweging in de kamer",
    iodevice: "kaku",
    event: "0xFFCDC89=On",
    action: function() {
        console.log('EVENT: beweging in de kamer');
    }
}
];
