//Script by Emily Pettit, 2018//

//function to load the map
function createMap(){
  //create map
  var map = L.map('map', {
    center: [48, 20],
    zoom: 4
  });

  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpwMyIsImEiOiJjamRrZ2g2d2EwMGoxMndxejdwd2poMGFhIn0.Ypo-SnygyDT2skpNIEQ60g", {
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'> Mapbox Light"
    }).addTo(map);

  getData(map);
};

//function to get data
function getData(map){
  //load data
  var swedes = $.ajax("data/swedes.geojson", {
    dataType: "json",
    success: function(response){

      //create marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#fff600",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //create leaflet layer
      L.geoJson(response, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(map);
    }
  });

  //load data
  var norwegians = $.ajax("data/norwegians.geojson", {
    dataType: "json",
    success: function(response){

      //create marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#0d00cc",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //create leaflet layer
      L.geoJson(response, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(map);
    }
  });
  //load data
  var danes = $.ajax("data/danes.geojson", {
    dataType: "json",
    success: function(response){

      //create marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#e20000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //create leaflet layer
      L.geoJson(response, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(map);
    }
  });
};

$(document).ready(createMap);
