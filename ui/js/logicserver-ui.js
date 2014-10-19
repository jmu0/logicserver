/*global alert, $ */
var Huis = {
    url: "http://domotica.muysers.nl",
    devices: undefined,
    ruimtes: ['keuken','kamer'],
    init: function() {
        $.get('devices', function(data) {
            Huis.devices = JSON.parse(data);
            Huis.showDevices();
        });
    },
    showDevices: function() {
        var html = "";
        var ruimte,i; 
        var type;
        var device; 
        html = '<br><table><tbody>';
        for (i in Huis.ruimtes) {
            if (Huis.ruimtes.hasOwnProperty(i)) {
                ruimte=Huis.ruimtes[i];
                html += "<tr><td class='kop1' colspan=2>"+ruimte+"</td></tr>";
                for(type in Huis.devices[ruimte]) {
                    if (Huis.devices[ruimte].hasOwnProperty(type)){
                        html += "<tr><td class='kop2' colspan=2>" + type + "</td></tr>";
                        for(device in Huis.devices[ruimte][type]){
                            if (Huis.devices[ruimte][type].hasOwnProperty(device)){
                                html += "<tr>";
                                html += "<td>"+device+"</td>";
                                html += "<td><input class='text' onchange=\"Huis.setcontrol('"+Huis.devices[ruimte][type][device].device+"','"+Huis.devices[ruimte][type][device].control+"',this.value)\" /></td>";
                                html += "</tr>";
                            }
                        }
                    }
                }
            }
        }
        $('div#apparaten').html(html);
    },
    setcontrol: function(device, control, value, callback) {
        var url = this.url+ "/setcontrol/"+device+"/"+control+"="+value;
        $.get(url,function(data){
            if (callback !== undefined) {
                callback(data);
            }
        });
    }
};
