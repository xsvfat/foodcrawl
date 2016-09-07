app.controller('signupController', ['$http', '$scope', '$state', '$localStorage', function($http, $scope, $state, $localStorage) {
  $scope.username;
  $scope.password;
  $scope.invalid = false;
  $scope.signupSubmit = (form) => {
    if (form.$valid) {
      $http({
        method: 'POST',
        url: '/signup',
        data: {
          username: $scope.username,
          password: $scope.password
        }
      }).then(result => {

        console.log('Signup result: ', result.data);
        if (result.data.valid) {
          // if signup is valid, save user to local storage and redirect to '/main'
          $localStorage.username = $scope.username;
          $state.go('main');
        } else {
          // if invalid signup, show error message
          $scope.password = '';
          $scope.invalid = true;
        }

        // if username exists, show error

        // otherwise save to local storage & redirect to '/main'
        // $localStorage.username = $scope.username;
        // $state.go('main');

      }).catch(err => {
        console.log('Error signing up: ', err);
      })
    }
  }
}])