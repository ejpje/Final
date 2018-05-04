/*Script by Emily Pettit 2018*/


var swedesSet = new L.geoJson().addTo(map);
var norwegiansSet = new L.geoJson().addTo(map);
var danesSet = new L.geoJson().addTo(map);


getSwedishSets(map, swedes, norwegians, danes, swedesSet, norwegiansSet, danesSet);
getNorwegianSets(map, swedes, norwegians, danes, swedesSet, norwegiansSet, danesSet);
getDaneSets(map, swedes, norwegians, danes, swedesSet, norwegiansSet, danesSet);

"Swedish Settlements": swedesSet,
"Norwegian Settlements": norwegiansSet,
"Danish Settlements": danesSet,
