/*Script by Emily Pettit, 2018*/

//function to instantiate the Leaflet map
function createMap(){
    //create the map object
    var map = L.map('map').setView([48, 20], 4);
    //specify additional datasets
    var swedes = new L.geoJson();
    var norwegians = new L.geoJson().addTo(map);
    var danes = new L.geoJson().addTo(map);

    getSwedes(map, swedes, norwegians, danes);
    getNorwegians(map, swedes, norwegians, danes);
    getDanes(map, swedes, norwegians, danes);

    //add OSM base tilelayer
    var osm = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpwMyIsImEiOiJjamRrZ2g2d2EwMGoxMndxejdwd2poMGFhIn0.Ypo-SnygyDT2skpNIEQ60g", {
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'> Mapbox Streets"
    }),
    //specify other basemap layers
        light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpwMyIsImEiOiJjamRrZ2g2d2EwMGoxMndxejdwd2poMGFhIn0.Ypo-SnygyDT2skpNIEQ60g", {
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'> Mapbox Light"
    }).addTo(map);

    var baseMaps = {
      "Light": light,
      "Streets": osm,
    };

    var overlayMaps = {
      "Swedish": swedes,
      "Danish": danes,
      "Norwegian": norwegians,
    };

    swedes.addTo(map);

    //create layer control panel
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    return map;
};

//function to get Swedish raid data
function getSwedes(map, swedes, danes, norwegians){
  //load Swedish Viking raid data
  $.ajax("data/swedes.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesSwedes(response, map, attributes);
    }
  });
};

//function to get Norwegian raid data
function getNorwegians(map, swedes, danes, norwegians){
  //load Norwegian Viking raid data
  $.ajax("data/norwegians.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesNorwegians(response, map, attributes);
    }
  });
};

//function to get Danish raid data
function getDanes (map, swedes, danes, norwegians){
  //load Danish Viking raid data
  $.ajax("data/danes.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesDanes(response, map, attributes);
    }
  });
};


//function to attach popup to each feature
function onEachFeature(feature, layer){
  //create html string with all properties
  var popupContent = "";
  if (feature.properties) {
    //loop to add feature property names and values to html string
    for (var property in feature.properties){
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  }
};


//function to convert markers to circles
function pointToLayer(feature, latlng, attributes){
  //determine which attribute to visualize
  var attribute = attributes[3];

  //create marker options
  if (attribute == "Swedes"){
    var options = {
      fillColor: "#fff600",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else
    if (attribute == "Norwegians"){
      var options = {
        fillColor: "#0300c1",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
  } else
    if (attribute == "Danes"){
      var options = {
        fillColor: "#e50b0b",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
    }

  //determine each feature's value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

  var layer = L.circleMarker(latlng, options);
  //return the circle marker to the L.geoJson pointToLayer option
  return layer;
};


//function to build an attribute array from the data
function processData(data){
  //empty array to hold attributes
  var attributes = [];
  //properties of the first feature in the dataset
  var properties = data.features[0].properties;
  //push each attribute name into attributes array
  for (var attribute in properties){
    //take attributes with raid century
    if (attribute.indexOf("Source") > -1){
      attributes.push(attributes);
    };
  };

  //check results
  console.log(attributes);

  return attributes;
};


//function to add circle markers for Swedish raid point features to the map
function createCirclesSwedes(data, swedes, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  swedeSize = L.geoJson(data,{
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(swedes);
};


//function to add circle markers for Norwegian raid point features to the map
function createCirclesNorwegians(data, norwegians, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  norwegianSize = L.geoJson(data,{
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(norwegians);
};


//function to add circle markers for Danish raid point features to the map
function createCirclesDanes(data, danes, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  daneSize = L.geoJson(data,{
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(danes);
};



$(document).ready(createMap);
