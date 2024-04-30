//Creating the map project
//We set the view to the Pittsburgh, PA coordinates
let myMap = L.map('map').setView([40.440624, -79.995888], 4);

//Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//API dataset for Past 7 Days via USGS
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Call the api with d3
d3.json(url).then(function(data){
    console.log(data);

    //Create a leaflet layer group
    let earthquakes = L.layerGroup();
    
    //Loop through the features
    data.features.forEach(function (feature) {
    // Get the coordinates of the earthquake
    let coordinates = feature.geometry.coordinates;
    let lat = coordinates[1];
    let lng = coordinates[0];
    let depth = coordinates[2];
  
    //Get the magnitude of the earthquake
    let magnitude = feature.properties.mag;
  
    //Create a circle markers
    let marker = L.circleMarker([lat, lng], {
      radius: magnitude * 3, 
      color: '#000',      
      weight: 1,              
      fillColor: getColor(depth),  
      fillOpacity: 0.7        
    });
      
    //Add a popup to the marker with information about the earthquake
    marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Depth:</strong> ${depth} km`);
      
      //Add the marker to the layer group
      marker.addTo(earthquakes);
    });
    
    //Add the layer group to the map
    earthquakes.addTo(myMap);
  
    //Define a function to get the color based on the depth of the earthquake
    function getColor(d) {
        return d > 90 ? '#D73027' :
               d > 70 ? '#4575B4' :
               d > 50 ? '#91BFDB' :
               d > 30 ? '#313695' :
               d > 10 ? '#FEE08B' :
               d > -10 ? '#A6D96A' :
               '#1A9850';
      }
  
    //Create a legend control
    let legend = L.control({position: 'bottomright'});

   //Add the legend to the map
   legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        depths_intervals = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
    //Loop through our depth intervals 
    for (let i = 0; i < depths_intervals.length; i++) {
    div.innerHTML +=
          '<i style="background:' + getColor(depths_intervals[i] + 1) + '"></i> ' +
          depths_intervals[i] + (depths_intervals[i + 1] ? '&ndash;' + depths_intervals[i + 1] + '<br>' : '+') + '<br>';
    }
    
    //Return the legend container with HTML content
    return div;

};
  //Add the legend control to the Leaflet map
  legend.addTo(myMap);
  
  });