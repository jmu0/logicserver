module.exports = {
    temperatuur: function() {
        return Home.convert(Home.devices.arduino01.an3.value(), 'temp');
    },
    licht: function() {
        return Home.devices.arduino01.an4.value();
    },
    beweging: function() {
        return Home.devices.arduino01.an5.value();
    }
};
