function initDemoMap() {
  var LightImagery = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  })

  var DarkImagery = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
        scrollWheelZoom: false,
        smoothWheelZoom: true,
        smoothSensitivity: 1,
  })

  var baseLayers = {
    //LightMap: LightImagery,
    DarkMap: DarkImagery
  };


  var map = L.map("map", {
    layers: [DarkImagery],
    scrollWheelZoom: false, // disable original zoom function
    smoothWheelZoom: true,  // enable smooth zoom 
    smoothSensitivity: 3,   // zoom speed. default is 1
  });

  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([42.3601, -71.0589], 3);

  return {
    map: map,
    layerControl: layerControl
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

$.getJSON("http://localhost:5050/latest", function(data) {
  velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Wind",
      position: "bottomleft",
      emptyString: "No wind data",
      showCardinal: true,
      speedUnit: "kt"
    },
    data: data,
    maxVelocity: 40,
    velocityScale: 0.008
  });

  layerControl.addOverlay(velocityLayer, "Wind");
  map.addLayer(velocityLayer);
});

// Event handler for when the user starts dragging the map
map.on('dragstart', function () {
  // Disable the additional layer while panning
  map.removeLayer(velocityLayer);
});

// Event handler for when the user stops dragging the map
map.on('dragend', function () {
  // Re-add the additional layer after panning is complete
  map.addLayer(velocityLayer);
});