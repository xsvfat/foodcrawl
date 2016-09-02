var app = angular.module('foodfood', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/main');

  $stateProvider
  .state('state1', {
    template: '<p>testing state 1</p>'
  })
  .state('main', {
    url: '/main',
    templateUrl: './views/main.html',
    controller: 'inputsController'
  })
  .state('main.list', {
    url: '/list',
    templateUrl: './views/places.html',
    controller: function($scope) {
      // restaurants from yelp API
      $scope.restaurants = [{
        restaurant: 'In n Out',
        rating: '4.0'
      }, {
        restaurant: 'Pizza Hut',
        rating: '2.8'
      }, {
        restaurant: 'KBBQ',
        rating: '5.0'
      }]
    }
  })
}])
