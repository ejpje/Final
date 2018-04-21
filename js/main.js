/*Script by Emily Pettit, 2018*/

//function to instantiate the Leaflet map
function createMap(){
  //create the map object
  var map = L.map('map').setView([48, 20], 4);
  //specify additional datasets to add to the layer group
  var swedes = new L.geoJson().addTo(map);
  var norwegians = new L.geoJson().addTo(map);
  var danes = new L.geoJson().addTo(map);

  //map data attribution
  swedes.getAttribution = function(){return "Map created by Emily Pettit | Raid data compiled from: 'Viking Empires' (Forte, Oram, Pedersen); 'The Viking Road to Byzantium' (Ellis Davidson); 'Kings and Vikings: Scandinavia and Europe, AD700-1100' (Sawyer); 'A History of the Vikings' (Jones); 'History of the Norwegian People' (Gjerset)"; };

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

  swedes.addTo(map);

  //create layer control panel
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
  return map;
};


//attach popup to each feature
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

  var year = feature.properties.Century;
  $("#century").html("<b>Display Century: </b>" + year);

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
      $(slider).append("<input class='range-slider' type='range' max=5 min=0 step=1 value=0>");

      //add skip buttons here
      $(slider).append("<button class='skip' id='forward' title='Forward'>Forward</button>");
      $(slider).append("<button class='skip' id='reverse' title='Reverse'>Reverse</button>");

      $(slider).on("mousedown dblclick", function(e){
        L.DomEvent.stopPropagation(e);
      });

      $(slider).on("mousedown", function(){
        map.dragging.disable();
      });
      return slider;
    }
  });

  //add code for legend changes here

  map.addControl(new SequenceControl());

  //slider buttons
  $("#forward").html("<img src='img/forwardarrow.svg'>");
  $("#reverse").html("<img src='img/reversearrow.svg'>");

  //click listener for buttons
  $(".skip").click(function(){
    //get the old index value
    var index = $(".range-slider").val();
    //increment or decrement depending on which button is clicked
    if ($(this).attr("id") == "forward"){
      index ++;
      //if past the last attribute then wrap around to the first
      index = index > 5 ? 0 : index;
    } else if ($(this).attr("id") == "reverse"){
      index --;
      //if past the first attribute then wrap around to the last
      index = index < 0 ? 5 : index;
    };
    //update slider
    $(".range-slider").val(index);
    //update symbols here
  });
  $(".range-slider").on("input", function(){
    //get the new index value
    var index = $(this).val();
    updateSymbolsSwedes(map, attributes[2]);
  });
};


//function to create temporal legend
function createTemporalLegend(map, attributes){
  var LegendControl = L.Control.extend({
    options:{
      position: "bottomright"
    },

    onAdd: function(map) {
      //create the control container with a particular class name
      var timestamp = L.DomUtil.create("div", "timestamp-container");
      $(timestamp).append("<div id='timestamp-container'>");
      return timestamp;
    }
  });
  map.addControl(new LegendControl());
  updateLegend(map, attributes);
};


/*
//function to create general legend
function createLegend(map, attributes){
  var LegendControl = L.Control.extend({
    options: {
      position: "bottomright"
    },

    onAdd: function(map){
      var container = L.DomUtil.create("div", "legend-control-container");
      var svg = "<svg id='attribute-legend' width='200' height='100'>";

      $(container).append("<class='label' id='label' title='label'>Raids</class>");
      $(container).append("<class='detail' id='detail' title='detail'>Source</class>");
      $(container).append(svg);
    }
  });
  map.addControl(new LegendControl);
  updateLegend(map, attributes);
};
*/

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
      //createSequenceControls(map, swedes, norwegians, danes, attributes);
      //createLegend(map, swedes, attributes);
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
      //createSequenceControls(map, swedes, norwegians, danes, attributes);
      //createLegend(map, norwegians, attributes);
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
      createSequenceControls(map, swedes, norwegians, danes, attributes);
      //createLegend(map, danes, attributes);
    }
  });
};


//function to update symbols
function updateSymbolsSwedes(swedes, map, attribute){
  swedes.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties;

      var year = feature.properties.Century;
      $("#century").html("<b>Display Century: </b>" + year);
      //$(".timestamp-container").text(feature.properties.Century);
    }
  });
};

//marker cluster?

//flow lines?


$(document).ready(createMap);
