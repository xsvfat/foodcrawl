app.factory('RestaurantAndRoute', ['$http', function($http) {
  
  var restaurants = [];

  return {

    fetchRestaurants: function() {
      // clear out the array for the new batch of restaurants
      // push fetched restaurants to the restaurants array
    },

    getRestaurants: function() {
      // returns the list of restaurants
      return restaurants;
    }
  }
}])