// Creating map object
var map = L.map("map-id", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 12,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// Adding URL 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Defining the colors for the markers of the map (circles)
var colors = ['#ADFF2F', '#F0E68C', '#FFD700', '#FFA500', '#D2691E', '#FF0000']

// create a function to get fill colors based on size
function fillColor(magnitude) {
  if (magnitude >= 0 && magnitude <= 1) {
    return colors[0];
  }
  else if (magnitude >= 1 && magnitude <= 2) {
    return colors[1];
  }
  else if (magnitude >= 2 && magnitude <= 3) {
    return colors[2];
  }
  else if (magnitude >= 3 && magnitude <= 4) {
    return colors[3];
  }
  else if (magnitude >= 4 && magnitude <= 5) {
    return colors[4];
  }
  else {
    return colors[5]
  }
}

// Grab the earthquake data with d3
d3.json(url, function(response) {

  // Create a variable to store features -> this is where the data we need is located
  var features = response.features
  // Loop through data
  for (var i = 0; i < features.length; i++) {

    // Set the data location property to a variable
    var latitude = features[i].geometry.coordinates[1];
    var longitude = features[i].geometry.coordinates[0];
    var magnitude = features[i].properties.mag;
    var place = features[i].properties.place;
    var location = place.split("of");
    var time = features[i].properties.time;
    var date_time = new Date(time).toLocaleDateString("en-US")

    // Create a circle marker using magnitude for size and color
    marker = L.circle([latitude, longitude],{
      fillOpacity: 0.75,
      weight: 0.5,
      fillColor: fillColor(magnitude),
      radius: magnitude * 20000
    }).addTo(map);

    // Bind a pop-up to the circle with Earthquake info
    marker.bindPopup("Earthquake Info:" +
                    "<br> Date: " + date_time +
                    "<br> Location:" + location[1] +
                    "<br>Magnitude: " + magnitude + "<br>"
                    );
  }
});

// Create a legend to display information about our map
var legend = L.control({
  position: "bottomright"
});

// Insert a div with the class of "legend"
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend")
  var categories = [0,1,2,3,4,5]
  for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(map);