// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', '$sce', function($scope, $http, $state, $sce) {

  $scope.start; // start location input
  $scope.end; // end location input
  
  $scope.directions = ''; // directions from start to end

  // POST users' start and end locations to server
  $scope.submit = function(form) {
    if (form.$valid) {
      // switch states to show restaurants and map
      $state.go('main.map');

      // POST start & end locations to server
      // server *should* return directions and list of restaurants
      $http({
        method: 'POST',
        url: '/maps/submit',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          start: $scope.start,
          end: $scope.end
        }
      }).then((response) => {

        var results = response.data.route;
        console.log('Returned route: ', results);
        console.log('Returned restaurant: ', response.data.restaurants);

        // reset the directions upon new search
        $scope.directions = '';

        // write out the steps from start to end
        results[0].legs[0].steps.forEach((step => {
          $scope.directions += step['html_instructions'] + '<br>';
        }));
      }).catch((err) => {
        console.log('Error submitting: ', err);
      })
    }
  };
}]);