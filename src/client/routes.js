var app = angular.module('foodfood', ['ui.router', 'ngSanitize', 'ngStorage']);

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
        controller: function($scope, RestaurantAndRoute, Auth) {
          // restaurants from the server
          $scope.restaurants = RestaurantAndRoute.getRestaurants();
        }
      },
      'map': {
        templateUrl: './views/map.html',
        controller: function($scope, RestaurantAndRoute, Auth) {
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

          // Associate the route with our current map
          directionsDisplay.setMap(map);

          // Immediately invoke the method with the passed in data.
          RestaurantAndRoute.calculateAndDisplayRoute(directionsService, directionsDisplay);

          // initialize the map to map.html
          console.log('map initiated');

          //clear existing markers
          RestaurantAndRoute.removeMarkers();
          //add restaurant markers
          RestaurantAndRoute.addMarkers(map);
        }
      }
    }
  })
}])
