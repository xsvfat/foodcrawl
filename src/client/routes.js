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
      $scope.items = ['bananas', 'cherries', 'krabby patties'];
    }
  })
}])
