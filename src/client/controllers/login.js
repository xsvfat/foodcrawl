app.controller('loginController', ['$http', '$scope', '$state', function($http, $scope, $state) {
  $scope.username;
  $scope.password;
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
        console.log('Login result: ', result);
        $state.go('main');
      }).catch(err => {
        console.log('Error signing in: ', err);
      })
    }
  }
}])