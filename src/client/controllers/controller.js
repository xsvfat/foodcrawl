// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', '$sce', 'RestaurantAndRoute', function($scope, $http, $state, $sce, RestaurantAndRoute) {

  $scope.start; // start location input
  $scope.end; // end location input
  
  $scope.directions = ''; // directions from start to end

  // POST users' start and end locations to server
  $scope.submit = function(form) {
    if (form.$valid) {
      // switch states to show restaurants and map
      $state.go('main.map');

      RestaurantAndRoute.fetchRestaurants($scope.start, $scope.end).then(restaurants => {
        // update list of restaurants in the factory
        console.log('restaurants: ', restaurants);
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
}]);