app.factory('Auth', ['$localStorage', function($localStorage) {
  var session = {
    username: null,
    password: null
  }
  return {
    store: (username, password) => {

    },
    check: () => {

    },
  }
}]);