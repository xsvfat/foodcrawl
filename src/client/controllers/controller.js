// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', '$sce', 'RestaurantAndRoute', 'Auth', '$localStorage', 'Addresses', function($scope, $http, $state, $sce, RestaurantAndRoute, Auth, $localStorage, Addresses) {

  if (true === false) { // bypass the conditional statement; remove later

    // if a user is not logged in, redirect to login page
    console.log('You are not logged in!');
    $state.go('login');

  } else {
    $scope.user; // the logged in user
    $scope.start = ''; // start location input
    $scope.end = ''; // end location input
    $scope.map; //store map
    $scope.directions = ''; // directions from start to end
    $scope.mode = 'driving';

    $scope.username;
    $scope.password;
    $scope.activeUser; // true if a user is logged in
    $scope.newUser = false; // true if a new user wants to sign up
    $scope.invalid = false; // true if username/password is invalid

    $scope.usernameNew;
    $scope.passwordNew;

    if ($localStorage.username) {
      $scope.user = $localStorage.username;
      $scope.activeUser = true;
    } else {
      $scope.user = null;
      $scope.activeUser = false;
    }

    $scope.showLoginForm = () => {
      // displays the login form
      $scope.newUser = false;
      $scope.activeUser = false;
    }

    $scope.loginSubmit = (form) => {
      if (form.$valid) {
        $http({
          method: 'POST',
          url: '/login',
          data: {
            username: $scope.username,
            password: $scope.password
          }
        }).then(result => {
          console.log('Login result: ', result.data);
          if (result.data.valid) {
            /* if username and password are correct,
               save to local storage and set active user */
            $localStorage.username = $scope.username;
            $scope.user = $scope.username;
            $scope.activeUser = true;
            $scope.username = '';
            $scope.password = '';
            $scope.invalid = false;
            $scope.newUser = false;
            $state.reload();
          } else {
            // show error message if credentials are invalid
            $scope.password = '';
            $scope.invalid= true;
          }
        }).catch(err => {
          console.log('Error signing in: ', err);
        })
      }
    };

    $scope.showNewUserForm = () => {
      // displays the sign-up form
      $scope.newUser = true;
      $scope.activeUser = false;
    };

    $scope.newUserSubmit = (form) => { // adds a new user to database
      if (form.$valid) {
        $http({
          method: 'POST',
          url: '/signup',
          data: {
            username: $scope.usernameNew,
            password: $scope.passwordNew
          }
        }).then(result => {
          console.log('Signup result: ', result.data);
          if (result.data.valid) {
            // if signup is valid, save user to local storage and redirect to '/main'
            $localStorage.username = $scope.usernameNew;
            $scope.user = $scope.usernameNew;
            $scope.activeUser = true;
            $scope.usernameNew = '';
            $scope.passwordNew = '';
            $scope.invalid = false;
            $scope.newUser = false; // hides newUser div
            $state.reload();
          } else {
            // if invalid signup, show error message
            $scope.passwordNew = '';
            $scope.invalid = true;
          }
        }).catch(err => {
          console.log('Error signing up: ', err);
        })
      }
    }

    $scope.logout = () => {
      console.log('Logged out');
      delete $localStorage.username;
      $scope.user = null;
      $scope.activeUser = false;
      $scope.newUser = false;
      $state.reload();
    }

    $scope.showOptions = false;
    $scope.invalidOptions = false;
    $scope.toggleOptions = () => {
      if ($localStorage.username) {
        $scope.showOptions = !$scope.showOptions; // toggles options view
        $scope.invalidOptions = false;
      } else {
        $scope.invalidOptions = true;
      }
    }

    $scope.showAddresses = false;
    $scope.invalidAddresses = false;
    $scope.toggleAddresses = () => {
      if ($localStorage.username) {
        $scope.showAddresses = !$scope.showAddresses; // toggles addresses view
        $scope.invalidAddresses = false;
      } else {
        $scope.invalidAddresses = true;
      }
    }

    // POST users' start and end locations to server
    $scope.submit = function(form) {
      //clear old data
      RestaurantAndRoute.clearStoredRestaurants();

      // to refresh states from main.map, need to redirect to main first
      $state.go('main');

      if (true) {
        RestaurantAndRoute.fetchRestaurants($scope.start, $scope.end, $scope.mode).then(restaurants => {
          $state.go('main.map');

          // update list of restaurants in the factory
          console.log('restaurants: ', restaurants);

          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer;
          var map;

          // create a map with restaurant markers and rendered route
          function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 14
            });
            $scope.map = map;
            // Associate the route with our current map
            directionsDisplay.setMap(map);
            //clear existing markers
            RestaurantAndRoute.removeMarkers();
            //add restaurant markers
            RestaurantAndRoute.addMarkers(map);
            // set the current route
            RestaurantAndRoute.calculateAndDisplayRoute(directionsService, directionsDisplay, $scope.start, $scope.end, $scope.mode);
          }
          initMap();

          // //clear start and end inputs
          // $scope.start = undefined;
          // $scope.end = undefined;
          
        }).catch(err => {
          console.log('Error submitting: ', err);
        });
      }
    };

    //Shows the appropriate restaurant info window on the map when clicked in the list
    $scope.showInfoWindow = (restaurant) => {
      RestaurantAndRoute.openInfoWindow($scope.map, restaurant.name);
    };

  }

}]);
