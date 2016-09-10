var app = angular.module('foodfood', ['ui.router', 'ngSanitize', 'ngStorage']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/main');

  $stateProvider
  .state('main', {
    url: '/main',
    views: {
      '': {
        templateUrl: './views/main.html',
        controller: 'inputsController'
      },
      'options@main': {
        templateUrl: './views/options.html',
        controller: 'optionsController'
      }
    }
  })
  .state('main.map', {
    url: '/map',
    views: {
      'restaurantList': {
        templateUrl: './views/places.html',
        controller: function($scope, RestaurantAndRoute, Auth, Addresses) {
          // restaurants from the server
          $scope.restaurants = RestaurantAndRoute.getRestaurants();
        }
      },
      'map': {
        templateUrl: './views/map.html',

        // controller: function($scope, RestaurantAndRoute) {
        //   //clear existing markers
        //   RestaurantAndRoute.removeMarkers();
        //   //add restaurant markers
        //   RestaurantAndRoute.addMarkers(map);
        // }
      }
    }
  })
}])
