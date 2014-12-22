/*global Home */
module.exports = {
    getList: function(){
        var i;
        var lst=[];
        for(i in Home.state) {
            if (Home.state.hasOwnProperty(i)){
                if (i !== "getList") {
                    lst.push(i);
                }
            }
        }
        return lst;
    }, 
    allesUit: function() {
        Home.devices.setControl(Home.kamer.verlichting.plafond1, 'off');
        Home.devices.setControl(Home.kamer.verlichting.plafond2, 'off');
        Home.devices.setControl(Home.kamer.verlichting.spot1, 'off');
        Home.devices.setControl(Home.kamer.verlichting.staand, 'off');
        Home.devices.setControl(Home.keuken.verlichting.plafond1, 'off');
    },
    allesAan: function() {
        Home.devices.setControl(Home.kamer.verlichting.plafond1, '16');
        Home.devices.setControl(Home.kamer.verlichting.plafond2, '16');
        Home.devices.setControl(Home.kamer.verlichting.spot1, '16');
        Home.devices.setControl(Home.kamer.verlichting.staand, '16');
        Home.devices.setControl(Home.keuken.verlichting.plafond1, 'on');
    },
    avond: function() {
        Home.devices.setControl(Home.kamer.verlichting.plafond1, '5');
        Home.devices.setControl(Home.kamer.verlichting.plafond2, '3');
        Home.devices.setControl(Home.kamer.verlichting.spot1, 'off');
        Home.devices.setControl(Home.kamer.verlichting.staand, '2');
    },
    film: function() {
        Home.devices.setControl(Home.kamer.verlichting.plafond1, 'off');
        Home.devices.setControl(Home.kamer.verlichting.plafond2, 'off');
        Home.devices.setControl(Home.kamer.verlichting.spot1, '6');
        Home.devices.setControl(Home.kamer.verlichting.staand, '1');
        Home.devices.setControl(Home.keuken.verlichting.plafond1, 'off');
    }
};

