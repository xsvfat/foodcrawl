var app = angular.module('foodfood', ['ui.router', 'ngStorage', 'ngAutocomplete', 'ui.materialize']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home/main');

  $stateProvider
  .state('home', {
    url: '/home',
    views: {
      '': {
        templateUrl: './views/home.html',
        controller: 'home'
      }
    }
  })
    .state('home.main', {
      url: '/main',
      views: {
        '': {
          templateUrl: './views/main.html',
          controller: 'inputsController'
        },
        'options@home.main': {
          templateUrl: './views/options.html',
          controller: 'optionsController'
        },
        'addresses@home.main': {
          templateUrl: './views/addresses.html',
          controller: 'addressesController'
        }
      }
    })
    .state('home.auth', {
      url: '/auth',
      views: {
        '': {
          templateUrl: './views/auth.html',
          controller: 'authController'
        }
      }
    })
    .state('home.main.map', {
      url: '/map',
      views: {
        'restaurantList': {
          templateUrl: './views/places.html',
          controller: function($scope, RestaurantAndRoute, Addresses) {
            // restaurants from the server
            $scope.sortTerm = '-review_count';
            $scope.setSortTerm = function (input) {
              if ($scope.sortTerm[0] === '-') {
                if ($scope.sortTerm.slice(1) === input) {
                  $scope.sortTerm = input;
                } else {
                  $scope.sortTerm = input; 
                }
              } else {
                if ($scope.sortTerm === input) {
                  $scope.sortTerm = '-' + input;
                } else {
                  $scope.sortTerm = input;
                }
              }
            };
            $scope.restaurants = RestaurantAndRoute.getRestaurants();
          }
        }
      }
    })

}])