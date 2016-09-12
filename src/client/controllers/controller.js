// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', 'RestaurantAndRoute', 'Auth', '$localStorage', 'Addresses', function($scope, $http, $state, RestaurantAndRoute, Auth, $localStorage, Addresses) {

  $scope.start = ''; // start location input
  $scope.end = ''; // end location input
  $scope.lastSearch = { // the most recent search input
    start: '',
    end: ''
  };
  $scope.map; // store map
  $scope.mode = 'driving';

  $scope.user;
  $scope.activeUser; // true if a user is logged in
  $scope.newUser = false; // true if a new user wants to sign up

  // toggles active user depending on the presence of a logged in user
  if ($localStorage.username) {
    $scope.activeUser = true;
    $scope.user = $localStorage.username;
  } else {
    $scope.activeUser = false;
  }

  $scope.logout = () => {
    console.log('Logged out');
    delete $localStorage.username;
    $scope.activeUser = false;
    $scope.newUser = false;
    $scope.user = null;
    $state.reload();
  };

  $scope.showOptions = false;
  $scope.invalidOptions = false;
  $scope.displayOptions = () => {
    if ($localStorage.username) {
      $scope.hideAddresses();
      $scope.showOptions = true; // toggles options view
      $scope.invalidOptions = false;
    } else {
      $scope.invalidOptions = true;
    }
  };

  $scope.hideOptions = () => {
    if ($localStorage.username) {
      $scope.showOptions = false; // toggles options view
      $scope.invalidOptions = false;
    } else {
      $scope.invalidOptions = true;
    }
  };

  $scope.showAddresses = false;
  $scope.invalidAddresses = false;
  $scope.displayAddresses = () => {
    if ($localStorage.username) {
      $scope.hideOptions();
      $scope.showAddresses = true; // toggles addresses view
      $scope.invalidAddresses = false;
    } else {
      $scope.invalidAddresses = true;
    }
  };

  $scope.hideAddresses = () => {
    if ($localStorage.username) {
      $scope.showAddresses = false; // toggles addresses view
      $scope.invalidAddresses = false;
    } else {
      $scope.invalidAddresses = true;
    }
  }

  // POST users' start and end locations to server
  $scope.submit = function(form) {
    //clear old data
    RestaurantAndRoute.clearStoredRestaurants();

    // start and end inputs get saved into lastSearch
    $scope.lastSearch.start = $scope.start ? $scope.start : $scope.lastSearch.start;
    $scope.lastSearch.end = $scope.end ? $scope.end : $scope.lastSearch.end;

    // to refresh states from main.map, need to redirect to main first
    $state.go('main');

    if (true) {
      RestaurantAndRoute.fetchRestaurants($scope.lastSearch.start, $scope.lastSearch.end, $scope.mode).then(restaurants => {
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
          RestaurantAndRoute.calculateAndDisplayRoute(directionsService, directionsDisplay, $scope.lastSearch.start, $scope.lastSearch.end, $scope.mode);
        }
        initMap();

        //clear start and end inputs
        $scope.start = undefined;
        $scope.end = undefined;
        
      }).catch(err => {
        console.log('Error submitting: ', err);
      });
    }
  };

  //Shows the appropriate restaurant info window on the map when clicked in the list
  $scope.showInfoWindow = (restaurant) => {
    RestaurantAndRoute.openInfoWindow($scope.map, restaurant.name);
  };

  $scope.stars = (rating) => {
    let numOfstars = Math.floor(rating);
    let result = '';
    for (let i=0; i<numOfstars; i++) {
      result += '★';
    }
    return result;
  }
}]);
