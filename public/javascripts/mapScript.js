mapboxgl.accessToken = "pk.eyJ1IjoicmVkZGJpc2N1aXRzIiwiYSI6ImNrc3N2NXc5aDAzYWMyeHNieml3Ym5mZHIifQ.tLy9z9H5Nhqmh4YqcEpFsQ";

let lon = document.querySelector("#longitude").value;
let lat = document.querySelector("#latitude").value;

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
}

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
});
