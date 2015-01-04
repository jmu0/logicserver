/*jslint todo: true */
/*global Home */

//TODO: split controllers into seperate files?

//CONTROLLER: beweging in de kamer
Home.loader.on('ready', function(){
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
