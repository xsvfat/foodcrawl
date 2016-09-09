app.factory('Addresses', ['$http', '$localStorage', function($http, $localStorage) {
  let addresses = [];

  return {
    getAddresses: () => {
      console.log('Local storage: ', $localStorage);
    },

    saveAddress: () => {
      console.log('sup');
    }
  };
}]);