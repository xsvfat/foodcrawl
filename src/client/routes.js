var app = angular.module('foodfood', ['ui.router', 'ngSanitize', 'ngStorage']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './views/login.html',
    controller: 'loginController'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: './views/signup.html',
    controller: 'signupController'
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
  .state('options', {
    url: '/options',
    templateUrl: './views/options.html',
    controller: function($scope, $state, Auth, $http, $localStorage) {

      if (!Auth.check()) {
        $state.go('login');
      } else {
        // a collection of user submitted preferences
        $scope.tags = [];

        // on page load, retrieve the user preferences from database
        $http({
          method: 'GET',
          url: '/options',
          params: {
            user: $localStorage.username
          }
        }).then(result => {
          // push the preferences to the list
          $scope.tags = result.data;
        }).catch(err => {
          console.log('Error retrieving preferences: ', err);
        });

        $scope.submitTag = () => {
          if ($scope.tags.indexOf($scope.prefs.toLowerCase()) === -1) {
            $scope.tags.push($scope.prefs.toLowerCase());
          }
          $scope.prefs = '';
        }

        $scope.deleteTag = (tag) => {
          $scope.tags.splice($scope.tags.indexOf(tag), 1);
        }

        $scope.save = () => {

          // save the collection of preferences to database
          $http({
            method: 'POST',
            url: '/options',
            data: {
              username: $localStorage.username,
              userPrefs: $scope.tags
            }
          }).then(results => {
            if (results.data.valid) {
              console.log('Preferences saved.');

              // redirect the user back to /main/map
              $state.go('main.map');

            } else {
              console.log('Something went wrong', results.data.message);
            }
          }).catch(err => {
            console.log('Error saving prefs: ', err);
          })


        }
      }
    }
  })
}])
