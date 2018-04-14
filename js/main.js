/*Script by Emily Pettit, 2018*/

//function to instantiate the Leaflet map
function createMap(){
    //create the map object
    var map = L.map('map').setView([48, 20], 4);
    //specify additional datasets

    var swedes = new L.geoJson().addTo(map);
    var danes = new L.geoJson().addTo(map);
    var norwegians = new L.geoJson().addTo(map);

    getSwedes(map, swedes, danes, norwegians);
    getDanes(map, swedes, danes, norwegians);
    getNorwegians(map, swedes, danes, norwegians);

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
    danes.addTo(map);
    norwegians.addTo(map);

    //create layer control panel
    L.control.layers(baseMaps, {collapsed:false}).addTo(map);
    return map;
};


//function to retrieve the data and place it on the map
function getData(map, raids){
  //load raid data
  $.ajax("data/raids.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
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
  var attribute = attributes[0];

  //create marker options
  if (attribute.includes("Swedes")){
    var options = {
      fillColor: "#fff600",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else
    if (attribute.includes("Norwegians")){
      var options = {
        fillColor: "#0300c1",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
  } else {
    if (attribute.includes("Danish")){
      var options = {
        fillColor: "#e50b0b",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
    }
  }
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
    //only take attributes with raid location
    if (attribute.indexOf("Date") > -1){
      attributes.push(attribute);
    };
  };

  //check results
  console.log(attributes);

  return attributes;
};


function getSwedes(map, swedes, danes, norwegians){
    //load Swedish Viking raid data
    $.ajax("data/swedes.geojson", {
      dataType: "json",
      success: function(response){
        //create attributes array
        var attributes = processData(response);
      }
    });
  };


function getNorwegians(map, swedes, danes, norwegians){
  //load Norwegian Viking raid data
  $.ajax("data/norwegians.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
    }
  });
};

function getDanes (map, swedes, danes, norwegians){
  //load Danish Viking raid data
  $.ajax("data/danes.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
    }
  });
};


//function to add circle markers for point features to the map
function createCircleSwedes(data, swedes, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  swedesCircle = L.geoJson(data,{
    //convert symbol to circle
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);
};*/

$(document).ready(createMap);
