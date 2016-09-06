app.factory('Auth', ['$localStorage', function($localStorage) {

  return {
    store: (username, password) => {
      $localStorage.username = username;
    },
    check: () => {
      return $localStorage.username;
    },
    delete: () => {
      delete $localStorage.username;
    }
  }
  
}]);