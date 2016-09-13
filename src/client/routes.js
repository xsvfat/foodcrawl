var app = angular.module('foodfood', ['ui.router', 'ngStorage', 'ngAutocomplete']);

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
      'login@main': {
        templateUrl: './views/login.html',
        controller: 'loginController'
      },
      'signup@main': {
        templateUrl: './views/signup.html',
        controller: 'signupController'
      },
      'options@main': {
        templateUrl: './views/options.html',
        controller: 'optionsController'
      },
      'addresses@main': {
        templateUrl: './views/addresses.html',
        controller: 'addressesController'
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
