/*Script by Emily Pettit, 2018*/

$(document).click(function(){
  console.log('hello');
  $("#welcomeWrapper").hide();
});

//function to create the Leaflet map
function createMap(){
  //create the map object
  var map = L.map('map').setView([48, 20], 4);
  //specify additional datasets to add to the layer group
  var swedes = new L.geoJson().addTo(map);
  var norwegians = new L.geoJson().addTo(map);
  var danes = new L.geoJson().addTo(map);

  //map data attribution
  swedes.getAttribution = function(){return};
  norwegians.getAttribution = function(){return};
  danes.getAttribution = function(){return};

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

  //swedes.addTo(map);

  //create layer control panel
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
  return map;
};


//function to convert markers to circles
function pointToLayer(feature, latlng, attributes){
  var first = feature.properties.Raid_700s;
  console.log(first);
  var second = feature.properties.Raid_800s;
  var third = feature.properties.Raid_900s;
  var fourth = feature.properties.Raid_1000s;

  if (first < 1){
    $(".first").hide();
  } else
  if (second < 1){
    $(second).hide();
  } else
  if (third < 1){
    $(third).hide();
  } else
  if (fourth < 1){
    $(fourth).hide();
  };

  //create marker options
  if (attributes.includes("Raid_Swedes")){
    var options = {
      radius: 6,
      fillColor: "#fff600",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var layer = L.circleMarker(latlng, options);
    var popupContent = "<p><b>Place:</b> " + feature.properties.Raid_Swedes + ", " + feature.properties.Raid_Country + "</p>" + "<p><b>Date:</b> " + feature.properties.Raid_Date + "</p>";
    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });
  } else if (attributes.includes("Raid_Norwegians")){
    var options = {
      radius: 6,
      fillColor: "#0d00cc",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    layer = L.circleMarker(latlng, options);
    popupContent = "<p><b>Place:</b> " + feature.properties.Raid_Norwegians + ", " + feature.properties.Raid_Country + "</p>" + "<p><b>Date:</b> " + feature.properties.Raid_Date + "</p>";
    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });

  } else if (attributes.includes("Raid_Danes")){
    var options = {
      radius: 6,
      fillColor: "#e20000",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    layer = L.circleMarker(latlng, options);
    popupContent = "<p><b>Place:</b> " + feature.properties.Raid_Danes + ", " + feature.properties.Raid_Country + "</p>" + "<p><b>Date:</b> " + feature.properties.Raid_Date + "</p>";
    layer.bindPopup(popupContent, {
      offset: new L.Point(0, -options.radius)
    });
  }
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
      $(slider).append("<input class='range-slider' type='range' max=6 min=3 step=1 value=0>");

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

  createTemporalLegend(map, attributes);

  map.addControl(new SequenceControl());

  //slider buttons
  $("#forward").html("<img src='img/forwardarrow.svg'>");//icon courtesy of Wikimedia Commons and Font Awesome (fortawesome.github.com/Font-Awesome/Font-Awesome)
  $("#reverse").html("<img src='img/reversearrow.svg'>");//icon courtesy of Wikimedia Commons and Font Awesome (fortawesome.github.com/Font-Awesome/Font-Awesome)

  //click listener for buttons
  $(".skip").click(function(){
    //get the old index value
    var index = $(".range-slider").val();
    //increment or decrement depending on which button is clicked
    if ($(this).attr("id") == "forward"){
      index ++;
      //if past the last attribute then wrap around to the first
      index = index > 6 ? 3 : index;
    } else if ($(this).attr("id") == "reverse"){
      index --;
      //if past the first attribute then wrap around to the last
      index = index < 3 ? 6 : index;
    };

    //update slider
    $(".range-slider").val(index);
    //update symbols here
    updateSymbolsSwedes(swedeSize, map, attributes[index]);

  });
  $(".range-slider").on("input", function(){
    //get the new index value
    var index = $(this).val();
    updateSymbolsSwedes(swedeSize, map, attributes[index]);
  });
};


//function to build an attribute array from the data
function processData(data){
  //empty array to hold attributes
  var attributes = [];
  //properties of the first feature in the dataset
  var properties = data.features[0].properties;
  console.log(properties);
  //push each attribute name into attributes array
  for (var attribute in properties){
    //take attributes
    if (attribute.indexOf("Raid_") > -1){
      attributes.push(attribute)
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
    }
  });
};


//function to update legend
function updateLegend(map, attributes){
  var content = "Year: ";
  $(".timestamp-container").text(content);
};

//function to create a time box
function createTemporalLegend(map, attributes){
  var LegendControl = L.Control.extend({
    options:{
      position: "topleft"
    },

    onAdd: function(map){
      //create the container
      var timestamp = L.DomUtil.create("div", "timestamp-container");
      $(timestamp).append("<div id='timestamp-container'>");
      return timestamp;
    }
  });
  map.addControl(new LegendControl());
  updateLegend(map, attributes);
};

//function to update symbols
function updateSymbolsSwedes(swedeSize, map, attribute){
  alert("wtf");
  swedeSize.eachLayer(function(layer){
    if(layer.feature && layer.feature.properties[attribute]){
      //access feature properties
      var prop = layer.feature.properties;

      updateLegend(map, attribute);
      $(".timestamp-container").text("Year: " + feature.properties.Raid_700s);
    }
  });
};

//spider?

//flow lines?


$(document).ready(createMap);
