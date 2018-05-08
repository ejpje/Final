/*Script by Emily Pettit, 2018*/

//welcome screen
$(document).click(function(){
  $("#welcomeWrapper").hide();
});
/*
//create global variable for icons
var settlementIcon = L.Icon.extend({
  options: {
    iconSize: [15, 40],
    popupAnchor: [0, -10]
  }
});

//specify the different settlement icons
var daneIcon = new settlementIcon({iconUrl: "img/danesSet.svg"}), //icon courtesy of Julynn B. and The Noun Project
    swedeIcon = new settlementIcon({iconUrl: "img/swedesSet.svg"}), //icon courtesy of Julynn B. and The Noun Project
    norwegianIcon = new settlementIcon({iconUrl: "img/norwegiansSet.svg"}); //icon courtesy of Julynn B. and The Noun Project
*/
var countries = L.layerGroup(Countries);

//function to color countries
function getColor(d) {
  return  d == "Sweden" ? "yellow" :
          d == "Norway" ? "blue" :
                          "red";
};

//function to style countries
function style(feature){
  return {
    fillColor: getColor(feature.properties.SOVEREIGNT),
    weight: 0.5,
    opacity: 0.5,
    color: "grey",
    fillOpacity: 0.4
  };
};

//function to create the Leaflet map
function createMap(){
  //create the map object
  var map = L.map("map", {
    center: [48, 20],
    zoom: 3,
    minZoom: 3,
    maxZoom: 8
  });

  L.geoJson(Countries, {style:style}).addTo(map);

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

/*
  //Swedish settlements
  L.marker([57.4684, 18.4867], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Gotland, Sweden</p>" + "<p><b>Settlement Date: </b>700</p>");
  L.marker([59.326,	17.5667], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Birka, Sweden</p>" + "<p><b>Settlement Date: </b>780</p>");
  L.marker([60.0016,	32.2926], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Staraja Ladoga, Russia</p>" + "<p><b>Settlement Date: </b>800</p>");
  L.marker([58.5256,	31.2742], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Novgorod, Russia</p>" + "<p><b>Settlement Date: </b>800</p>");
  L.marker([60.0299,	37.8057], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Beloozero, Russia</p>" + "<p><b>Settlement Date: </b>850</p>");
  L.marker([59.6191,	17.7234], {icon: swedeIcon}).addTo(swedes).bindPopup("<p><b>Place:</b> Sigtuna, Sweden</p>" + "<p><b>Settlement Date: </b>960</p>");
  //Norwegian settlements
  L.marker([59.297,	10.5694], {icon: norwegianIcon}).addTo(norwegians).bindPopup("<p><b>Place:</b> Kaupang, Norway</p>" + "<p><b>Settlement Date: </b>800</p>");
  L.marker([50.4501,	30.5234], {icon: norwegianIcon}).addTo(norwegians).bindPopup("<p><b>Place:</b> Kiev, Ukraine</p>" + "<p><b>Settlement Date: </b>860</p>");
  L.marker([64.9631,	-19.0208], {icon: norwegianIcon}).addTo(norwegians).bindPopup("<p><b>Place:</b> Iceland</p>" + "<p><b>Settlement Date: </b>870</p>");
  L.marker([61.8926,	-6.9118], {icon: norwegianIcon}).addTo(norwegians).bindPopup("<p><b>Place:</b> Faroe Islands</p>" + "<p><b>Settlement Date: </b>880</p>");
  L.marker([71.7069,	-42.6043], {icon: norwegianIcon}).addTo(norwegians).bindPopup("<p><b>Place:</b> Greenland</p>" + "<p><b>Settlement Date: </b>985</p>");
  //Danish settlements
  L.marker([48.8799, 0.1713], {icon: daneIcon}).addTo(danes).bindPopup("<p><b>Place:</b> Normandy, France</p>" + "<p><b>Settlement Date: </b>911</p>");
  L.marker([54.2194, 9.6961], {icon: daneIcon}).addTo(danes).bindPopup("<p><b>Place:</b> Danevirke, Germany</p>" + "<p><b>Settlement Date: </b>974</p>");
*/

  //create layer control panel
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
  return map;
};


//function to attach popup to each feature
function onEachFeature(feature, layer){
  var popupContent = "";
  if (feature.properties){
    //loop to add feature property names and values
    for (var property in feature.properties){
      popupContent += "<p><b>Place:</b> " + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  }
};


//function to convert markers to circles
function pointToLayer(feature, latlng, attributes){
  var attribute = attributes[0];

  //create marker options
  if (feature.properties.SwedesRaidSettlement == 1){
    var options = {
      fillColor: "#c4aa03",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (feature.properties.NorwegianRaidSettlement == 1){
    var options = {
      fillColor: "#06036b",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (feature.properties.DanesRaidSettlement == 1){
    var options = {
      fillColor: "#660207",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (attribute.includes("SwedesRaid")){
    var options = {
      fillColor: "#fff600",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (attribute.includes("NorwegiansRaid")){
    var options = {
      fillColor: "#0d00cc",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (attribute.includes("DanesRaid")){
    var options = {
      fillColor: "#e20000",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  //for each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

  options.radius = calcPropRadius(attValue);

  //create circle marker layer
  var layer = L.circleMarker(latlng, options);

  //call the create popup function
  createPopUp(feature.properties, attribute, layer, options);

  //event listeners to open popup on mouse movement
  layer.on({
    mouseover: function(){
      this.openPopup();
      this.setStyle({color: "white", weight: 3});
    },
    mouseout: function(){
      this.closePopup();
      this.setStyle({color: "black", weight: 1});
    }
  });
  //return the circle marker to the L.geoJson pointToLayer option
  return layer;
};


//function to calculate the radius of each proportional symbol
function calcPropRadius(attValue){
  //scale factor to adjust symbol size evenly
  var scaleFactor = 50;
  //area based on attribute value and scale factor
  var area = attValue * scaleFactor;
  //radius calculated based on area
  var radius = (Math.sqrt(area/Math.PI))*(2);

  return radius;
};


//function to add circle markers for Swedish raid point features to the map
function createPropSymbolsSwedes(data, swedes, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  swedeSize = L.geoJson(data,{
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(swedes);
};
//function to add circle markers for Norwegian raid point features to the map
function createPropSymbolsNorwegians(data, norwegians, attributes){
  //create Leaflet GeoJSON layer and add it to the map
  norwegianSize = L.geoJson(data,{
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(norwegians);
};
//function to add circle markers for Danish raid point features to the map
function createPropSymbolsDanes(data, danes, attributes){
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
      position: "bottomleft",
    },
    onAdd: function(map){
      //create the container div for the slider
      var slider = L.DomUtil.create("div", "range-slider-container");

      //create range input element (the slider)
      $(slider).append("<input class='range-slider' type='range' max=3 min=0 value=0 step=1>");

      //add skip buttons here
      $(slider).append("<button class='skip' id='forward' title='Forward'>Forward</button>");
      $(slider).append("<button class='skip' id='reverse' title='Reverse'>Reverse</button>");

      $(slider).on("mousedown dblclick pointerdown", function(e){
        L.DomEvent.stopPropagation(e);
      });
      return slider;
    }
  });

  createTimeBox(map, attributes);
  createLegendSwedes(map, attributes[0]);

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
      index = index > 3 ? 0 : index;
    } else if ($(this).attr("id") == "reverse"){
      index --;
      //if past the first attribute then wrap around to the last
      index = index < 0 ? 3 : index;
    };

    //update slider
    $(".range-slider").val(index);
    updatePropSymbolsSwedes(swedeSize, map, attributes[index]);
    updatePropSymbolsNorwegians(norwegianSize, map, attributes[index]);
    updatePropSymbolsDanes(daneSize, map, attributes[index]);
  });

  //input listener for the slider
  $(".range-slider").on("input", function(){
    //get the new index value
    var index = $(this).val();
    updatePropSymbolsSwedes(swedeSize, map, attributes[index]);
    updatePropSymbolsNorwegians(norwegianSize, map, attributes[index]);
    updatePropSymbolsDanes(daneSize, map, attributes[index]);
  });
};


//function to create temporal legend
function createTimeBox(map, attributes){
  var LegendControl = L.Control.extend({
    options:{
      position: "topleft",
    },

    onAdd: function(map){
      //create the temporal legend container
      var timestamp = L.DomUtil.create("div", "timestamp-container");
      $(timestamp).append();
      return timestamp;
    }
  });
  map.addControl(new LegendControl());
  updateTimeBox(map, attributes);
};


//function to create the attribute legend
function createLegendSwedes(map, attributes){
  var LegendControl = L.Control.extend({
    options: {
      position: "bottomright"
    },
    onAdd: function(map){
      //create container
      var container = L.DomUtil.create("div", "legend-control-container");
      //create second container for the settlement icons
      var sub = L.DomUtil.create("div", "table-of-contents"),
        grades = ["Swedish raids ", " Swedish settlements ", "Norwegian raids ", "Norwegian settlements ", "Danish raids ", "Danish settlements "],
        labels = ["img/swedeRaid.png", "img/swedeImg.png", "img/norwegianRaid.png", "img/norwegianImg.png", "img/daneRaid.png", "img/daneImg.png"];

      //add temporal legend component
      $(container).append("<div id='temporal-legend'>");

      //start attribute legend svg string
      var svg = "<svg id='attribute-legend' width='160px' height='60px'>";
      //positioning of circle labels
      var circlesR = {
        maxR: 50,
      //  meanR: 80,
        //minR: 110
      };
      //loop to add each circle and text to svg string
      for (var circle in circlesR){
        //circle string
        svg += "<circle class='legend-circle' id='" + circle + "' fill='#ffffff' fill-opacity='0.8' stroke='#000000' cx='50'/>";
        //text string
        svg += "<text id='" + circle + "-text' x='90' y='" + circlesR[circle] + "'></text>";
      };
      //close svg string
      svg += "</svg>"
      //add attribute legend svg to container
      $(container).append(svg);
      //add table of contents legend to container
      $(container).append(sub);

      //loop to add icons to the table of contents legend with labels
      for (var i = 0; i < grades.length; i++) {
        sub.innerHTML +=
          grades[i] + ("<img src=" + labels[i] + " height='17' width='17'>") + "<br>";
      };
      $(container).append(sub);

      return container;
    }

  });
  map.addControl (new LegendControl);
  updateLegendSwedes(map, attributes);
};


//function to update the timestamp box
function updateTimeBox(feature, attributes, properties, layer){
  var attribute = attributes[0];

  $(".timestamp-container").text("Century: " + attribute.split("_")[1]);
};


//function to update the attribute legend
function updateLegendSwedes(swedeSize, attribute){
  var year = attribute.split("_")[1];
  var content = "Raids in " + year;
  $("#temporal-legend").html(content);

  var circleValuesSwede = getCircleValuesSwede(swedeSize, attribute)

  for (var key in circleValuesSwede){
    //get the radius
    var radius = calcPropRadius(circleValuesSwede[key]);
    //assign the cy and r attributes
    $("#"+key).attr({
      cy: 55 - radius,
      r: radius
    });
    //add legend text
    $("#"+key+'-text').text(Math.round(circleValuesSwede[key]*100)/100 + " raids");
  };
};


//function to calculate the max, mean, and min values for the Swede symbols
function getCircleValuesSwede(map, attribute){
  var minR = Infinity,
      maxR = -Infinity;

  map.eachLayer (function(layer){
    //get the attribute value
    if (layer.feature){
      var attributeValue = Number(layer.feature.properties[attribute]);

      //test for min
      if (attributeValue < minR){
        minR = attributeValue
      };
      //test for max
      if (attributeValue > maxR){
        maxR = attributeValue;
      };
    };
  });
  //set mean
  var meanR = (maxR + minR) / 2;
  //return values as an object
  return {
    maxR: maxR,
    minR: minR,
    meanR: meanR
  };
};
//function to calculate the max, mean, and min values the Norwegian symbols
function getCircleValuesNorwegian(map, attribute){
  var minR = Infinity,
      maxR = -Infinity;
  map.eachLayer (function(layer){
    //get the attribute value
    if (layer.feature){
      var attributeValue = Number(layer.feature.properties[attribute]);

      //test for min
      if (attributeValue < minR){
        minR = attributeValue
      };
      //test for max
      if (attributeValue > maxR){
        maxR = attributeValue;
      };
    };
  });
  //set mean
  var meanR = (maxR + minR) / 2;
  //return values as an object
  return {
    maxR: maxR,
    minR: minR,
    meanR: meanR
  };
};

//function to calculate the max, mean, and min values for the Dane symbols
function getCircleValuesDane(map, attribute){
  var minR = Infinity,
      maxR = -Infinity;
  map.eachLayer (function(layer){
    //get the attribute value
    if (layer.feature){
      var attributeValue = Number(layer.feature.properties[attribute]);

      //test for min
      if (attributeValue < minR){
        minR = attributeValue
      };
      //test for max
      if (attributeValue > maxR){
        maxR = attributeValue;
      };
    };
  });
  //set mean
  var meanR = (maxR + minR) / 2;
  //return values as an object
  return {
    maxR: maxR,
    minR: minR,
    meanR: meanR
  };
};


//function to build an attribute array from the data
function processData(data){
  //empty array to hold attributes
  var attributes = [];
  //properties of the first feature in the dataset
  var properties = data.features[0].properties;
  //push each attribute name into attributes array
  for (var attribute in properties){
    //take attributes
    if (attribute.indexOf("Raid") > -1){
      attributes.push(attribute)
    };
  };
  return attributes;
};


//function to get Swedish raid data and put it on the map
function getSwedes(map, swedes, norwegians, danes){
  //load Swedish Viking raid data
  $.ajax("data/swedesnull.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createPropSymbolsSwedes(response, swedes, attributes);
    //  swedeRouteLines(map, routeStaraya);
    }
  });
};

//function to get Norwegian raid data and put it on the map
function getNorwegians(map, swedes, norwegians, danes){
  //load Norwegian Viking raid data
  $.ajax("data/norwegiansnull.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createPropSymbolsNorwegians(response, norwegians, attributes);
    }
  });
};

//function to get Danish raid data and put it on the map
function getDanes (map, swedes, norwegians, danes){
  //load Danish Viking raid data
  $.ajax("data/danesnull.geojson", {
    dataType: "json",
    success: function(response){
      //create attributes array
      var attributes = processData(response);
      //call function to create symbols
      createPropSymbolsDanes(response, danes, attributes);
      createSequenceControls(map, swedes, norwegians, danes, attributes);
    }
  });
};


//function to update Swedish Viking symbols
function updatePropSymbolsSwedes(swedeSize, map, attribute){
  swedeSize.eachLayer(function(layer){
    //attribute is called originally for the Danes layer, so it needs to be replaced with Swedes
    var attributeSwedes = attribute.replace("Danes", "Swedes")

    if(layer.feature && layer.feature.properties[attributeSwedes]){
      //access feature properties
      var props = layer.feature.properties;

      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attributeSwedes]);
      layer.setRadius(radius);

      //call the create popup function
      createPopUp(props, attributeSwedes, layer, radius);
      updateLegendSwedes(map, attributeSwedes);
    }
  });
};

//function to update Norwegian Viking symbols
function updatePropSymbolsNorwegians(norwegianSize, map, attribute){
  norwegianSize.eachLayer(function(layer){
    //attribute is called originally for the Danes layer, so it needs to be replaced with Norwegians
    var attributeNorwegians = attribute.replace("Danes", "Norwegians")

    if(layer.feature && layer.feature.properties[attributeNorwegians]){
      //access feature properties
      var props = layer.feature.properties;

      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attributeNorwegians]);

      layer.setRadius(radius);

      //call the create popup function
      createPopUp(props, attributeNorwegians, layer, radius);
    }
  });
};

//function to update Danish Viking symbols
function updatePropSymbolsDanes(daneSize, map, attribute){
  daneSize.eachLayer(function(layer){
    if(layer.feature && layer.feature.properties[attribute]){
      //access feature properties
      var props = layer.feature.properties;

      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attribute]);

      layer.setRadius(radius);

      //call the create popup function
      createPopUp(props, attribute, layer, radius);
      updateLegendSwedes(map, attribute);
      $(".timestamp-container").text("Century: " + attribute.split("_")[1]);
    }
  });
};


//function to create popup content
function createPopUp(properties, attribute, layer, radius){
  //create popup content variable and add location and date to it
  var popupContent = " ";

  //specify the label by Viking group
  if (properties.SwedesRaidSettlement == 1){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Settlement Date: </b> " + properties.RaidDate + "</p>";
  } else
  if (properties.NorwegianRaidSettlement == 1){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Settlement Date: </b> " + properties.RaidDate + "</p>";
  } else
  if (properties.DaneRaidSettlement == 1){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Settlement Date: </b> " + properties.RaidDate + "</p>";
  } else
  if (attribute.includes("SwedesRaid")){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Raid Date(s): </b> " + properties.RaidDate + "</p>" + "<p><b>Number of Raids in " + attribute.split("_")[1] + "s: </b>" + properties[attribute] + "</p>";
  } else
  if (attribute.includes("NorwegiansRaid")){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Raid Date(s): </b> " + properties.RaidDate + "</p>" + "<p><b>Number of Raids in " + attribute.split("_")[1] + "s: </b>" + properties[attribute] + "</p>";
  } else
  if (attribute.includes("DanesRaid")){
    popupContent += "<p><b>Place:</b> " + properties.Location + "</p>" + "<p><b>Raid Date(s): </b>" + properties.RaidDate + "</p>" + "<p><b>Number of Raids in " + attribute.split("_")[1] + "s: </b>" + properties[attribute] + "</p>";
  }

  layer.bindPopup(popupContent, {
    offset: new L.Point(0,1)
  });
};


/*
//function to create travel lines
function swedeRouteLines(map, routeStaraya, routeNovgorod){
  for (var i = 0, latlngs = [], len = routeStaraya.length; i < len; i++) {
    latlngs.push(new L.LatLng(routeStaraya[i][0], routeStaraya[i][1]));
  }
  var path1 = L.polyline(latlngs, {snakingSpeed: 200});
  map.fitBounds(L.latLngBounds(latlngs));
  map.addLayer(path1);
  path1.bindPopup("Hello");
  function snake(){
    path1.snakeIn();
  }
  path1.on("snakestart snake snakeend", function(ev){
    alert("hey");
    console.log(ev.type);
  });
};
//if re-enabling route lines, don't forget to activate code line in getData block
*/



$(document).ready(createMap);
