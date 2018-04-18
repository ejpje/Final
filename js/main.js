/*Script by Emily Pettit, 2018*/

//function to instantiate the Leaflet map
function createMap(){
  //create the map object
  var map = L.map('map').setView([48, 20], 4);
  //specify additional datasets to add to the layer group
  var swedes = new L.geoJson().addTo(map);
  var norwegians = new L.geoJson().addTo(map);
  var danes = new L.geoJson().addTo(map);

  //add the raid data to the map
  getSwedes(map, swedes, norwegians, danes);
  getNorwegians(map, swedes, norwegians, danes);
  getDanes(map, swedes, norwegians, danes);

  //add OSM base tilelayer to the map
  var osm = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpwMyIsImEiOiJjamRrZ2g2d2EwMGoxMndxejdwd2poMGFhIn0.Ypo-SnygyDT2skpNIEQ60g", {
      attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'> Mapbox Streets"
  }),
  //specify other basemap layers to add
      light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpwMyIsImEiOiJjamRrZ2g2d2EwMGoxMndxejdwd2poMGFhIn0.Ypo-SnygyDT2skpNIEQ60g", {
      attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'> Mapbox Light"
  }).addTo(map);

  //basemaps to add
  var baseMaps = {
    "Greyscale": light,
    "Streets": osm,
  };

  //overlay maps to add
  var overlayMaps = {
    "Swedish": swedes,
    "Norwegian": norwegians,
    "Danish": danes,
  };

  //create layer control panel
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
  return map;
};


// attach popup to each feature
function onEachFeature(feature, layer){
  //create an html string with all properties
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
  if (attributes.includes("Raid_LocationSwedes")){
    var options = {
      radius: 6,
      fillColor: "#fff600",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var layer = L.circleMarker(latlng, options);
    var popupContent = "<p><b>City:</b> " + feature.properties.Raid_LocationSwedes + "</p>" + "<p><b>Date:</b> " + feature.properties.Date + "</p>";
    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });
  } else if (attributes.includes("Raid_LocationNorwegians")){
    var options = {
      radius: 6,
      fillColor: "#0d00cc",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    layer = L.circleMarker(latlng, options);
    popupContent = "<p><b>City:</b> " + feature.properties.Raid_LocationNorwegians + "</p>" + "<p><b>Date:</b> " + feature.properties.Date + "</p>";
    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });
  } else if (attributes.includes("Raid_LocationDanes")){
    var options = {
      radius: 6,
      fillColor: "#e20000",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    layer = L.circleMarker(latlng, options);
    popupContent = "<p><b>City:</b> " + feature.properties.Raid_LocationDanes + "</p>" + "<p><b>Date:</b> " + feature.properties.Date + "</p>";

    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });
  }
  //determine each feature value based on a selected attribute
  var attValue = Number(feature.properties[attribute]);

  //event listeners to open popup on mouse movement
  layer.on({
    mouseover: function(){
      this.openPopup();
    },
    mouseout: function(){
      this.closePopup();
    },
  });

  //return the circle marker to the L.geoJson pointToLayer option
  return layer;
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



//function to create sequence controls
function createSequenceControls(map, swedes, norwegians, danes, attributes){
  var SequenceControl = L.Control.extend({
    options: {
      position: "bottomleft"
    },

    onAdd: function(map){
      //create the container div for the slider
      var slider = L.DomUtil.create("div", "range-slider-container");
      $(slider).append("<input class='range-slider' type='range' max=8 min=0 step=1 value=0>");

      //add skip buttons here
      $(slider).on("mousedown dblclick", function(e){
        L.DomEvent.stopPropagation(e);
      });

      $(slider).on("mousedown", function(){
        map.dragging.disable();
      });
      return slider;
    }
  });

  map.addControl(new SequenceControl());
  //add in code for slider buttons/click listeners/etc.
};

//create temporal legend?
//create general legend
//add function to update legend(s)



//function to build an attribute array from the data
function processData(data){
  //empty array to hold attributes
  var attributes = [];
  //properties of the first feature in the dataset
  var properties = data.features[1].properties;

  console.log(properties);

  //push each attribute name into attributes array
  for (var attribute in properties){
    //take attributes
    if (attribute.indexOf("Raid_Location") > -1){
      attributes.push(attribute);
    };
  };

  //check results
  console.log(attributes);

  return attributes;
};


//function to get Swedish raid data
function getSwedes(map, swedes, norwegians, danes){
  //load Swedish Viking raid data
  $.ajax("data/swedes.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesSwedes(response, swedes, attributes);
      //createSequenceControls(map, norwe/swe/dan, attributes);
    }
  });
};
//function to get Norwegian raid data
function getNorwegians(map, swedes, norwegians, danes){
  //load Norwegian Viking raid data
  $.ajax("data/norwegians.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesNorwegians(response, norwegians, attributes);
      //createSequenceControls(map, norwe/swe/dan, attributes);
    }
  });
};
//function to get Danish raid data
function getDanes (map, swedes, norwegians, danes){
  //load Danish Viking raid data
  $.ajax("data/danes.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createCirclesDanes(response, danes, attributes);
      //createSequenceControls(map, norwe/swe/dan, attributes);
    }
  });
};


//update symbols?




$(document).ready(createMap);
