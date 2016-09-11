app.controller('addressesController', ['$scope', 'Addresses', '$rootScope', function($scope, Addresses, $rootScope) {

  $scope.places = []; // list of user's saved addresses

  $scope.address = { // user's input values from the form
    label: '',
    location: '',
  };

  //set any retrieved addresses
  $scope.getAddresses = () => {
    Addresses.getAddresses()
    .then(addresses => {
      $scope.places = addresses.data;
    });
  };

  //get addresses when logging in
  $scope.getAddresses();

  //add an address, then refresh addresses
  $scope.saveAddress = (address) => {
    if (address.$valid) {
      Addresses.saveAddress($scope.address)
      .then(() => {
        $scope.getAddresses();
        //clear inputs
        $scope.address = {
          label: '',
          location: ''
        };
      });
    }
  };

  //add address to appropriate field
  $scope.addAddress = (address) => {
    $rootScope.start === undefined ? $rootScope.start = address.location : $rootScope.end = address.location;
  };

}]);