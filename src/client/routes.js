var app = angular.module('foodfood', ['ui.router', 'ngSanitize']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './views/login.html',
    controller: 'loginController'
  })
  .state('main', {
    url: '/main',
    templateUrl: './views/main.html',
    controller: 'inputsController'
  })
  .state('main.map', {
    url: '/map',
    views: {
      'restaurantList': {
        templateUrl: './views/places.html',
        controller: function($scope, RestaurantAndRoute) {
          // restaurants from the server
          $scope.restaurants = RestaurantAndRoute.getRestaurants();
        }
      },
      'map': {
        templateUrl: './views/map.html',
        controller: function($scope, RestaurantAndRoute) {
          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer;
          var map;
          var coord = new google.maps.LatLng(37.8, -122.4);

          function initMap(coord) { // creates a map
            map = new google.maps.Map(document.getElementById('map'), {
              center: coord,
              zoom: 14
            })
          }
          initMap(coord);

          directionsDisplay.setMap(map);


          function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
              // hardcoded the important route from where Eric and I live to school
              origin: '944 market st',
              destination: '1412 15th st, sf, CA',
              travelMode: 'DRIVING'
            }, function(response, status) {
              console.log('Response: ', response);
              console.log('Status: ', status);
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
          }

          // Immediately invoke the method with the passed in data.
          calculateAndDisplayRoute(directionsService, directionsDisplay);

          // initialize the map to map.html
          console.log('map initiated');
        }
      }
    }
  })
}])
