$(document).ready(() => {
  $('body').on('submit', '#routeSearch', (e) => {
    e.preventDefault();
    console.log('start and end locations submitted');
    var coord = new google.maps.LatLng(37.8, -122.4);
    initMap(coord);
    console.log('map initiated');
  })
  console.log('hey');
})

var map;
function initMap(coord) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coord,
    zoom: 14
  })
}