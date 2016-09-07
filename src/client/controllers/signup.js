app.controller('signupController', ['$http', '$scope', '$state', '$localStorage', function($http, $scope, $state, $localStorage) {
  $scope.username;
  $scope.password;
  $scope.loginSubmit = (form) => {
    if (form.$valid) {
      $http({
        method: 'POST',
        url: '/signup',
        data: {
          username: $scope.username,
          password: $scope.password
        }
      }).then(result => {

        console.log('Signup result: ', result);

        // if username exists, show error

        // otherwise save to local storage & redirect to '/main'
        $localStorage.username = $scope.username;
        $state.go('main');

      }).catch(err => {
        console.log('Error signing in: ', err);
      })
    }
  }
}])