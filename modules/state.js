/*global Home */
function setControl(control, value) {
    Home.ioclient.write('setcontrol ' + control.iodevice + " " + control.iocontrol+"="+ value);
}
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
        setControl(Home.kamer.verlichting.plafond1, 'off');
        setControl(Home.kamer.verlichting.plafond2, 'off');
        setControl(Home.kamer.verlichting.spot1, 'off');
        setControl(Home.kamer.verlichting.staand, 'off');
        setControl(Home.keuken.verlichting.plafond1, 'off');
    },
    allesAan: function() {
        setControl(Home.kamer.verlichting.plafond1, '16');
        setControl(Home.kamer.verlichting.plafond2, '16');
        setControl(Home.kamer.verlichting.spot1, '16');
        setControl(Home.kamer.verlichting.staand, '16');
        setControl(Home.keuken.verlichting.plafond1, 'on');
    },
    avond: function() {
        setControl(Home.kamer.verlichting.plafond1, '5');
        setControl(Home.kamer.verlichting.plafond2, '3');
        setControl(Home.kamer.verlichting.spot1, 'off');
        setControl(Home.kamer.verlichting.staand, '2');
    },
    film: function() {
        setControl(Home.kamer.verlichting.plafond1, 'off');
        setControl(Home.kamer.verlichting.plafond2, 'off');
        setControl(Home.kamer.verlichting.spot1, '6');
        setControl(Home.kamer.verlichting.staand, '1');
        setControl(Home.keuken.verlichting.plafond1, 'off');
    }
};

