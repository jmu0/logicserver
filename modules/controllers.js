/*jslint todo: true */
/*global Home */

//TODO: split controllers into seperate files?

Home.loader.on('ready', function(){
    //Beweging in de kamer
    var time = 2 * 60 * 1000;
    var timeout;
    var threshold = 10;
    var aangezet = false; 
    var orig = {
        plafond1: Home.kamer.verlichting.plafond1.value,
        plafond2: Home.kamer.verlichting.plafond2.value
    };
    Home.events.on('beweging in de kamer', function() {
        if (Home.debug) { console.log('BEWEGING IN DE KAMER!'); }
        if(Home.kamer.sensors.licht.value < threshold) {
            if (aangezet === false) {
                orig.plafond1 = Home.kamer.verlichting.plafond1.value;
                orig.plafond2 = Home.kamer.verlichting.plafond2.value;
            }
            console.log('CONTROLLER: beweging in de kamer > te donker > licht aan');
            Home.controls.setControl(Home.kamer.verlichting.plafond1, '8');
            Home.controls.setControl(Home.kamer.verlichting.plafond2, '8');
            aangezet = true;
        }
        console.log(orig);
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (aangezet) {
                console.log('CONTROLLER: oude waarden terugzetten');
                Home.controls.setControl(Home.kamer.verlichting.plafond1, orig.plafond1);
                Home.controls.setControl(Home.kamer.verlichting.plafond2, orig.plafond2);
                aangezet = false;
            }
        }, time);
    });
});

Home.loader.on('ready', function(){
    //Beweging in de keuken
    var time = 2 * 60 * 1000;
    var timeout;
    var threshold = 50;
    var aangezet = false; 
    var orig = {
        aanrecht: Home.keuken.verlichting.aanrecht.value
    };
    Home.events.on('beweging in de keuken', function() {
        if (Home.debug) { console.log('BEWEGING IN DE KEUKEN!'); }
        if(Home.kamer.sensors.licht.value < threshold) {
            if (aangezet === false) {
                orig.aanrecht = Home.keuken.verlichting.aanrecht.value;
            }
            console.log('CONTROLLER: beweging in de keuken > te donker > licht aan');
            Home.controls.setControl(Home.keuken.verlichting.aanrecht, '16');
            aangezet = true;
        }
        if (Home.debug){console.log(orig);}
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (aangezet) {
                console.log('CONTROLLER: oude waarden terugzetten');
                Home.controls.setControl(Home.keuken.verlichting.aanrecht, orig.aanrecht);
                aangezet = false;
            }
        }, time);
    });
});
