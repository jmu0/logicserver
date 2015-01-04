/*global Home */
Home.loader.on('ready', function() {
    Home.message.on('setstate', Home.state.set);
});
module.exports = {
    getList: function() {
        var i;
        var lst = [];
        for (i in Home.state) {
            if (Home.state.hasOwnProperty(i)) {
                if (i !== "getList" && i !== "set") {
                    lst.push(i);
                }
            }
        }
        return lst;
    },
    set: function(data) {
        if (data.state) {
            if (Home.state[data.state] !== undefined) {
                if (Home.debug) {
                    console.log('Setting state: ' + data.state);
                }
                Home.state[data.state]();
            } else {
                if (Home.debug) {
                    console.log('ERROR invalid state: ' + data.state);
                }
            }
        }
    },
    allesUit: function() {
        Home.controls.setControl(Home.kamer.verlichting.plafond1, 'off');
        Home.controls.setControl(Home.kamer.verlichting.plafond2, 'off');
        Home.controls.setControl(Home.kamer.verlichting.spot1, 'off');
        Home.controls.setControl(Home.kamer.verlichting.staand, 'off');
        Home.controls.setControl(Home.keuken.verlichting.plafond1, 'off');
    },
    allesAan: function() {
        Home.controls.setControl(Home.kamer.verlichting.plafond1, '16');
        Home.controls.setControl(Home.kamer.verlichting.plafond2, '16');
        Home.controls.setControl(Home.kamer.verlichting.spot1, '16');
        Home.controls.setControl(Home.kamer.verlichting.staand, '16');
        Home.controls.setControl(Home.keuken.verlichting.plafond1, 'on');
    },
    avond: function() {
        Home.controls.setControl(Home.kamer.verlichting.plafond1, '5');
        Home.controls.setControl(Home.kamer.verlichting.plafond2, '3');
        Home.controls.setControl(Home.kamer.verlichting.spot1, 'off');
        Home.controls.setControl(Home.kamer.verlichting.staand, '2');
    },
    film: function() {
        Home.controls.setControl(Home.kamer.verlichting.plafond1, 'off');
        Home.controls.setControl(Home.kamer.verlichting.plafond2, 'off');
        Home.controls.setControl(Home.kamer.verlichting.spot1, '6');
        Home.controls.setControl(Home.kamer.verlichting.staand, '1');
        Home.controls.setControl(Home.keuken.verlichting.plafond1, 'off');
    }
};
