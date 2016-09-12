app.controller('loginController', ['$http', '$scope', '$state', '$localStorage', function($http, $scope, $state, $localStorage) {
  $scope.username;
  $scope.password;
  $scope.invalid = false;
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

        console.log('Login result: ', result.data);
        if (result.data.valid) {
          /* if username and password are correct,
             save to local storage and set active user */
          $localStorage.username = $scope.username;
          $scope.$parent.user = $scope.username;
          $scope.$parent.activeUser = true;
          $scope.username = '';
          $scope.password = '';
          $scope.invalid = false;
          $scope.$parent.newUser = false;
          $state.reload();
        } else {
          $scope.password = '';
          $scope.invalid = true;
        }
      }).catch(err => {
        console.log('Error signing in: ', err);
      })
    }
  }

  $scope.showNewUserForm = () => {
    // displays the sign-up form
    $scope.$parent.newUser = true;
    $scope.$parent.activeUser = false;
  };
  console.log($scope.$parent);
}])