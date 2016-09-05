app.factory('RestaurantAndRoute', ['$http', function($http) {

  var restaurants = [];

  return {

    fetchRestaurants: function(origin, destination) {
      // clear out the array for the new batch of restaurants
      restaurants = [];

      // request the restaurants from the server
      $http({
        method: 'POST',
        url: '/maps/submit',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          start: origin,
          end: destination
        }
      }).then(data => {

        // push fetched restaurants to the restaurants array

      }).catch(err => {

        // handle errors

      })
    },

    getRestaurants: function() {
      // returns the list of restaurants
      return restaurants;
    }
  }
}])