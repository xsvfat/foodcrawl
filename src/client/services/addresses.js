app.factory('Addresses', ['$http', '$localStorage', function($http, $localStorage) {
  let addresses = [];

  return {
    getAddresses: () => {
      console.log('Local storage: ', $localStorage.username);

      $http({
        method: 'GET',
        url: '/addresses',
        params: { 
          user: $localStorage.username
        }
      })
      .then((addresses) => {
        console.log('RETURNED ADDRESSES: ', addresses);
        return addresses;
      })
      .catch((error) => {
        console.log('Error getting user addreses: ', error);
      })

    },

    saveAddress: () => {
      console.log('sup');
    }
  };
}]);