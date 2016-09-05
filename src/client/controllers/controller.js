// controller for start & end inputs
app.controller('inputsController', ['$scope', '$http', '$state', function($scope, $http, $state) {

  $scope.start // start location input
  $scope.end // end location input

  // POST users' start and end locations to server
  $scope.submit = function(form) {
    if (form.$valid) {
      $state.go('main.map');
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
      }).then((data) => {
        console.log('Returned data: ', JSON.parse(JSON.parse(JSON.stringify(data.data.body))).routes);
      }).catch((err) => {
        console.log('Error submitting: ', err);
      })
    }
  };
}]);