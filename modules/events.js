module.exports = [
    {
    name: "test event",
    device: "arduino02",
    event: "di13 =0",
    action: function() {
        console.log("PAAF! het ledje is uit!");
    }
},
{
    name: "beweging in de kamer",
    device: "arduino02",
    event: "an5 >500",
    action: function() {
        console.log('beweging in de kamer');
    }
}
];
