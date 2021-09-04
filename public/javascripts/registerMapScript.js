mapboxgl.accessToken = "pk.eyJ1IjoicmVkZGJpc2N1aXRzIiwiYSI6ImNrc3N2NXc5aDAzYWMyeHNieml3Ym5mZHIifQ.tLy9z9H5Nhqmh4YqcEpFsQ";
const map = new mapboxgl.Map({
  container: "map", //container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [13.3, 52.5], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
// const marker = new mapboxgl.Marker({
//   draggable: true,
// })
//   .setLngLat([13.4, 52.52])
//   .addTo(map);
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
  map.addSource("single-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: "point",
    source: "single-point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#448ee4",
    },
  });

  // Listen for the `result` event from the Geocoder
  // `result` event is triggered when a user makes a selection
  //  Add a marker at the result's coordinates
  geocoder.on("result", ({ result }) => {
    map.getSource("single-point").setData(result.geometry);
    //document.querySelector(".locationField").innerText = result.geometry;
    console.log("result.geometry", result.geometry);
    document.querySelector("#longitude").value = result.geometry.coordinates[0];
    document.querySelector("#latitude").value = result.geometry.coordinates[1];
    
  });
});
