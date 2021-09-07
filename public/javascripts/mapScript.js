mapboxgl.accessToken = "pk.eyJ1IjoicmVkZGJpc2N1aXRzIiwiYSI6ImNrc3N2NXc5aDAzYWMyeHNieml3Ym5mZHIifQ.tLy9z9H5Nhqmh4YqcEpFsQ";

let lon = document.querySelector("#longitude").value;
let lat = document.querySelector("#latitude").value;
let llon = document.querySelector("#loc-longitude");
let llat = document.querySelector("#loc-latitude"); 

const map = new mapboxgl.Map({
  container: "map", //container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [lon, lat], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({
  draggable: true,
})
  .setLngLat([lon, lat])
  .addTo(map);

for (let index = 0; index < 200; index++) {
  let llonEl = document.querySelector("#loc-longitude-" + index);
  let llatEl = document.querySelector("#loc-latitude-" + index);
  if (llonEl && llatEl) {
    const llon = llonEl.value;
    const llat = llatEl.value;
    const marker = new mapboxgl.Marker().setLngLat([llon, llat]).addTo(map);
  }
};

// Create a GeoJSON source with an empty lineString.
let geojson = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": []
    }
  }]
};



let startPoint = [lon, lat];
let endPoint = [llon, llat];

let framesPerSecond = 20;
let initialOpacity = 1
let opacity = initialOpacity;
let initialRadius = 4;
let radius = initialRadius;
let maxRadius = 15;

let speedFactor = 100 // number of frames per longitude degree
let animation; // to store and cancel the animation

const nav = new mapboxgl.NavigationControl({ visualizePitch: true });
map.addControl(nav, "top-left");

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
});

// Add the geocoder to the map
map.addControl(geocoder);
// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on("load", () => {

  // Point 1
  map.addSource("single-point", {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": [],
      "coordinates": [
        startPoint[0], startPoint[1]
      ]
    },
  });

  map.addLayer({
    "id": "circle1",
    "source": "single-point",
    "type": "circle",
    "paint": {
      "circle-radius": initialRadius,
      "circle-radius-transition": {
        duration: 0
      },
      "circle-opacity-transition": {
        duration: 0
      },
      "circle-color": "#B70404"
    }
  }); 

  map.addLayer({
    "id": "single-point",
    "source": "single-point",
    "type": "circle",
    "paint": {
      "circle-radius": 20,
      "circle-color": "#B70404",
    },
  });

  // Listen for the `result` event from the Geocoder
  // `result` event is triggered when a user makes a selection
  //  Add a marker at the result's coordinates
  geocoder.on("result", ({ result }) => {
    console.log("result from mapbox", result);
    map.getSource("single-point").setData(result.geometry);
    //document.querySelector(".locationField").innerText = result.geometry;
    console.log("result.geometry", result.geometry);
    document.querySelector("#newname").value = result.place_name;
    document.querySelector("#longitude").value = result.geometry.coordinates[0];
    document.querySelector("#latitude").value = result.geometry.coordinates[1];
    document.querySelector("#newlongitude").value = result.geometry.coordinates[0];
    document.querySelector("#newlatitude").value = result.geometry.coordinates[1];
  });

  // Point 2
  map.addSource('point2', {
    "type": "geojson",
    "data": {
      "type": "Point",
      "coordinates": [
        endPoint[0], endPoint[1]
      ]
    }
  });
  map.addLayer({
    "id": "circle2",
    "source": "point2",
    "type": "circle",
    "paint": {
      "circle-radius": initialRadius,
      "circle-radius-transition": {
        duration: 0
      },
      "circle-opacity-transition": {
        duration: 0
      },
      "circle-color": "#B70404"
    }
  });

  map.addLayer({
    "id": "point2",
    "source": "point2",
    "type": "circle",
    "paint": {
      "circle-radius": initialRadius,
      "circle-color": "#B70404"
    }
  });

  //Line
  map.addLayer({
    'id': 'line-animation',
    'type': 'line',
    'source': {
      'type': 'geojson',
      'data': geojson
    },
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#B70404',
      'line-width': 2
    }
  });

  let diffX = endPoint[0] - startPoint[0];
  let diffY = endPoint[1] - startPoint[1];

  let sfX = diffX / speedFactor;
  let sfY = diffY / speedFactor;

  let i = 0;
  let j = 0;

  let lineCoordinates = [];

  while (i < diffX || Math.abs(j) < Math.abs(diffY)) {
    lineCoordinates.push([startPoint[0] + i, startPoint[1] + j]);

    if (i < diffX) {
      i += sfX;
    }

    if (Math.abs(j) < Math.abs(diffY)) {
      j += sfY;
    }
  }

  console.log(lineCoordinates);

  let animationCounter = 0;

  function animateLine() {
    if (animationCounter < lineCoordinates.length) {
      geojson.features[0].geometry.coordinates.push(lineCoordinates[animationCounter]);
      map.getSource('line-animation').setData(geojson);

      requestAnimationFrame(animateLine);
      animationCounter++;
    } else {
      let coord = geojson.features[0].geometry.coordinates;
      coord.shift();
      console.log(coord);

      if (coord.length > 0) {
        geojson.features[0].geometry.coordinates = coord;
        map.getSource('line-animation').setData(geojson);

        //-------------- Point2 Animation End ---------------
        requestAnimationFrame(animateLine);
      }
    }

  }

  animateLine();
  
});
