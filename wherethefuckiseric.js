
const fs = require("fs");
const { parse } = require("csv-parse");


// map
var map = L.map('map').setView([30, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// cities with coordinates
test = fs.createReadStream("wherethefuckiseric/places.csv");
test.pipe(parse({ delimiter: ",", from_line: 2}))
.on("data", function (row){
    console.log(row);
});

// history of places I have been, sorted



// MAIN
const polyline = [];

for(i in history){
    place = history[i];

    // find place coordinates 
    for(i in places){
        endroit = places[i];
        if (endroit.name == place.name){
            position = endroit.position;
            // finish
        }
    };

    console.log(place.name);

    // draw circle on map
    var circle = L.circle(position, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 1000
    }).addTo(map);

    // add description
    circle.bindPopup(place.notes);

    // add coordinates to polyline list
    // polyline.add(position);
    polyline.push(position);

};