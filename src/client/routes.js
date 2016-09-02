var app = angular.module('foodfood', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/main');

  $stateProvider
  .state('state1', {
    template: '<p>testing state 1</p>'
  })
  .state('main', {
    url: '/main',
    templateUrl: './views/view.html',
    controller: 'inputsController'
  })
  .state('main.list', {
    url: '/list',
    template: '<ul><li ng-repeat="item in items">{{item}}</li></ul>',
    controller: function($scope) {
      $scope.items = ['bananas', 'cherries'];
    }
  })
}])
