// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', '$sce', 'RestaurantAndRoute', 'Auth', function($scope, $http, $state, $sce, RestaurantAndRoute, Auth) {

  if (!Auth.check()) {

    // if a user is not logged in, redirect to login page
    console.log('You are not logged in!');
    $state.go('login');

  } else {

    $scope.start; // start location input
    $scope.end; // end location input
    
    $scope.directions = ''; // directions from start to end

    $scope.logout = () => {
      Auth.delete();
      $state.go('login');
    }

    // POST users' start and end locations to server
    $scope.submit = function(form) {

      // to refresh states from main.map, need to redirect to main first
      $state.go('main');
      
      if (form.$valid) {
        RestaurantAndRoute.fetchRestaurants($scope.start, $scope.end).then(restaurants => {
          
          // update list of restaurants in the factory
          console.log('restaurants: ', restaurants);

          // switch states to show restaurants and map
          $state.go('main.map');

        }).catch(err => {
          console.log('Error submitting: ', err);
        })





        // // POST start & end locations to server
        // // server *should* return directions and list of restaurants
        // $http({
        //   method: 'POST',
        //   url: '/maps/submit',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   data: {
        //     start: $scope.start,
        //     end: $scope.end
        //   }
        // }).then((response) => {

        //   var results = response.data.route;
        //   var route = response.data.route[0];
        //   var list = response.data.restaurants;
        //   console.log('Returned route: ', route);
        //   console.log('Returned restaurant: ', list);

        //   // reset the directions upon new search
        //   $scope.directions = '';

        //   // write out the steps from start to end
        //   results[0].legs[0].steps.forEach((step => {
        //     $scope.directions += step['html_instructions'] + '<br>';
        //   }));
        // }).catch((err) => {
        //   console.log('Error submitting: ', err);
        // })
      }
    };
  }

}]);