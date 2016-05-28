/*global document, $ */
var br = (function() {
    var iconUrl = "https://preview.buienradar.nl/resources/images/icons/weather/30x30/";
    //huidig
    var header = document.querySelector('h3#weer');
    $.get("https://api.buienradar.nl/data/actual/1.0/weatherstation/6391", function(data) {
        header.innerHTML = "Lottum: " + "<img src='" + iconUrl + data.iconcode + ".png'/>";
        header.innerHTML += data.temperature + " &#176;C " + data.winddirection + " " + data.windspeedBft;
    });
    //image
    var div = document.querySelector('div#br');
    var frameWidth = 350;
    var frames = 12;
    var currentFrame = 0;
    var pos = 0;
    var intervalTime = 200;
    setTimeout(function() {
        setInterval(function() {
            currentFrame++;
            if (currentFrame > frames) {
                currentFrame = 0;
            }
            pos = (currentFrame * frameWidth) - frameWidth;
            div.style.backgroundPosition = "-" + pos + "px 0px";
        }, intervalTime);
    }, 1000);

    //weertabel
    var url = "https://api.buienradar.nl/data/forecast/1.1/daily/2751422";
    var tbl = document.querySelector('table#weer tbody');
    var i, html, d;
    var dagen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    var maanden = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    setTimeout(function() {
        $.get(url, function(data) {
            html = "";
            for (i = 0; i < data.days.length; i++) {
                d = new Date(data.days[i].date);
                html += "<tr class='" + dagen[d.getDay()] + "'>";
                html += "<td>" + dagen[d.getDay()] + " " + d.getDate() + " " + maanden[d.getMonth()] + "</td>";
                html += "<td><img src='" + iconUrl + data.days[i].iconcode + ".png'/></td>";
                html += "<td>" + data.days[i].mintemperature + "&#176;C/" + data.days[i].maxtemperature + "&#176;C</td>";
                html += "<td>" + data.days[i].precipitation + "%</td><td>" + data.days[i].precipitationmm + "mm</td>";
                html += "<td>" + data.days[i].winddirection + "</td><td>" + data.days[i].beaufort + "</td>";
                html += "</tr>";
            }
            tbl.innerHTML = html;
        });
    }, 1500);
}());
