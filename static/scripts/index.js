function getWind(time) {

  var isoDate = time.toISOString();
  $.getJSON("http://localhost:5050/nearest?timeIso=" + isoDate, function (data) {

  if (map.hasLayer(velocityLayer)) {
    map.removeLayer(velocityLayer);
  }

    velocityLayer = L.velocityLayer({
      displayValues: false,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomright",
        emptyString: "No wind data",
        showCardinal: true,
        speedUnit: "kt"
      },
      data: data,
      maxVelocity: 40,
      velocityScale: 0.008
    });

    map.addLayer(velocityLayer);
  });

}


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
    LightMap: LightImagery,
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

  $.getJSON("http://localhost:5050/latest", function (data) {

    velocityLayer = L.velocityLayer({
      displayValues: false,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomright",
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

  var slider = L.control.slider(function (value) {

    var date = new Date();

    date.setHours(date.getHours() - value);
    getWind(date);
  }, {
    min: -60,
    max: 60,
    value: 0,
    step: 6,
    size: '500px',
    position: 'bottomleft',
    orientation: 'horizontal',
    collapsed: false,
    id: 'slider'
  });

  slider.addTo(map);

  var button = new L.Control.Button('Click me', {
    position: "bottomleft"
  });
  button.addTo(map);
  button.on('click', function () {
    map.removeLayer(velocityLayer);
    var date = new Date();
    getWind(date);
  });

  return {
    map: map,
    layerControl: layerControl
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

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