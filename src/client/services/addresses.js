app.factory('Addresses', ['$http', '$localStorage', function($http, $localStorage) {
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

    //Saves a new address
    saveAddress: (address) => {
      //add username to address
      address.user = $localStorage.username;

      return $http({
        method: 'POST',
        url: '/addresses',
        data: address
      })
      .catch(error => {
        console.log('Error saving user address: ', error);
      })      
    }
  };
}]);