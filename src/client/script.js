$(document).ready(() => {
  $('body').on('submit', '#routeSearch', (e) => {
    e.preventDefault();

    // temporary choose HR coordinates for map initialization
    // remove later
    var coord = new google.maps.LatLng(37.8, -122.4);

    // initialize the map to index
    initMap(coord);
    console.log('map initiated');

    var formResults = $('#routeSearch :input').serializeArray();
    formResults.forEach((data) => {
      console.log(data);
    })
  })
})

var map;
function initMap(coord) { // creates a map
  map = new google.maps.Map(document.getElementById('map'), {
    center: coord,
    zoom: 14
  })
}