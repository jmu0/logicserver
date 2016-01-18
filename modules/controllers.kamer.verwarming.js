/*jslint todo: true  */
/*global Home */

var gewenst; //override gewenste temperatuur
var checkInterval = 5 * 1000 * 60; //interval waartussen gechecked wordt
//DEBUG:var checkInterval = 1500;
var interval; //wordt ingesteld met setinterval
var lastTemp; //vorige gemeten temp
var trend = 'const';
var logfile = '/var/log/temp.kamer.log';
var fs = require('fs');

var getGewenst = function() {
    var laag = 15; //temperatuur laag
    var hoog = 21; //temperatuur hoog
    //TODO: get gewenste temperatuur uit scheduler
    var now = new Date();
    var dow = now.getDay();
    var hour = now.getHours();
    var ret = 0;
    if (gewenst) { 
        ret = gewenst;
    } else {
        if (dow === 0 || dow === 6) { //weekend
            if (hour >= 1 && hour < 8) {
                ret = laag;
            } else {
                ret = hoog;
            }
        } else { //door de week
            if (hour >=0 && hour < 16) {
                ret = laag;
            } else {
                ret = hoog;
            }

        }
    }
    return ret;
};
//haal gemeten temperatuur
var getGemeten = function() {
    var gemeten = 0;
    //TODO: get gemeten temperatuur
    if (Home.kamer.sensors.temperatuur) {
        gemeten = Home.kamer.sensors.temperatuur.value;
    }
    if (gemeten > lastTemp) {
        trend = 'stijgend';
    } else if (gemeten < lastTemp) {
        trend = 'dalend';
    } else { 
        trend = 'const';
    }
    lastTemp = gemeten;
    return gemeten;
};
var setVerwarming = function(level) {
    switch(level){
        case 1:
            Home.controls.setControl(Home.kamer.verwarming.radiator1, '0');
            Home.controls.setControl(Home.kamer.verwarming.radiator2, '0');
            Home.controls.setControl(Home.kamer.verwarming.radiator3, '1');
            break;
        case 2:
            Home.controls.setControl(Home.kamer.verwarming.radiator1, '1');
            Home.controls.setControl(Home.kamer.verwarming.radiator2, '0');
            Home.controls.setControl(Home.kamer.verwarming.radiator3, '1');
            break;
        case 3:
            Home.controls.setControl(Home.kamer.verwarming.radiator1, '1');
            Home.controls.setControl(Home.kamer.verwarming.radiator2, '1');
            Home.controls.setControl(Home.kamer.verwarming.radiator3, '1');
            break;
        default:
            Home.controls.setControl(Home.kamer.verwarming.radiator1, '0');
            Home.controls.setControl(Home.kamer.verwarming.radiator2, '0');
            Home.controls.setControl(Home.kamer.verwarming.radiator3, '0');
    }
};
//check gewenst-gemeten en zet verwarming aan/uit
var check = function() {
    var gewenst = getGewenst();
    var gemeten = getGemeten();
    var verschil = gemeten - gewenst;
    var now = new Date();
    var line = now.toDateString() + " " + now.toLocaleTimeString();
    line += "," + gewenst;
    line += "," + gemeten;
    line += "," + trend;
    if (verschil < -2) {
        setVerwarming(3);
        line += ",3";
    } else if (verschil <= 2 && verschil >= -2) {
        switch(trend){
            case "stijgend":
                setVerwarming(0);
                line += ",0";
                break;
            case "dalend":
                setVerwarming(2);
                line += ",2";
                break;
            default:
                setVerwarming(1);
                line += ",1";
        }
    } else { 
        setVerwarming(0);
        line += ",0";
    }
    line += "\n";
    fs.appendFile(logfile, line);
    if (Home.debug) { console.log(line); }
};

Home.loader.on('ready', function(){
    check();
    interval = setInterval(check, checkInterval);
});

module.exports = {
    setGewenst: function(temp) {
        gewenst = temp;
        check();
    }, 
    getGewenst: function() {
        var ret;
        if (gewenst) {
            ret = gewenst;
        } else {
            ret = getGewenst();
        }
        return ret;
    }
};

