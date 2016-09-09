app.factory('Addresses', ['$http', '$localStorage', function($http, $localStorage) {
  let addresses = [];

  return {
    //Gets an array of addresses
    getAddresses: () => {
      return $http({
        method: 'GET',
        url: '/addresses',
        params: { 
          user: $localStorage.username
        }
      })
      .catch(error => {
        console.log('Error getting user addreses: ', error);
      });
    },

    saveAddress: () => {
      console.log('sup');
    }
  };
}]);