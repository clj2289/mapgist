var map;

require(["esri/map", "dojo/domReady!"], function(Map) {
	map = new Map("map", {
	basemap: "topo",
	center: [-122.45,37.75], // long, lat
	zoom: 13,
	sliderStyle: "small"
	});
});