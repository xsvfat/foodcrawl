app.controller('signupController', ['$http', '$scope', '$state', '$localStorage', function($http, $scope, $state, $localStorage) {

  $scope.usernameNew;
  $scope.passwordNew;

  $scope.invalid = false; // true if username/password is invalid

  $scope.newUserSubmit = (form) => { // adds a new user to database
    if (form.$valid) {
      $http({
        method: 'POST',
        url: '/signup',
        data: {
          username: $scope.usernameNew,
          password: $scope.passwordNew
        }
      }).then(result => {

        console.log('Signup result: ', result.data);
        if (result.data.valid) {
          /* if signup is valid, save user to local storage
           and set active user */
          $localStorage.username = $scope.usernameNew;
          $scope.$parent.user = $scope.usernameNew;
          $scope.$parent.activeUser = true;
          $scope.usernameNew = '';
          $scope.passwordNew = '';
          $scope.invalid = false;
          $scope.$parent.newUser = false; // hides newUser div
          $state.reload();
        } else {
          // if invalid signup, show error message
          $scope.passwordNew = '';
          $scope.invalid = true;
        }
      }).catch(err => {
        console.log('Error signing up: ', err);
      });
    }
  };

  $scope.showLoginForm = () => {
    // displays the login form
    $scope.$parent.newUser = false;
    $scope.$parent.activeUser = false;
  };
}])