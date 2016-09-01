// controller for start/end inputs
app.controller('inputsController', '$http', ['$scope', function($scope, $http) {
  $scope.start // start location input
  $scope.end // end location input
  $scope.submit = $http({
    method: 'POST',
    url: '/maps/submit',
    data: {
      start: $scope.start,
      end: $scope.end
    }
  })
}]);