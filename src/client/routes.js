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
