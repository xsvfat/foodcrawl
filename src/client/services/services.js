app.factory('RestaurantAndRoute', ['$http', function($http) {

  var restaurants = [];

  return {

    fetchRestaurants: function(origin, destination) {
      // clear out the array for the new batch of restaurants
      restaurants = [];

      // request the restaurants from the server
      return $http({
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

        // filter out any restaurants farther than 60m
        restaurants = data.data.restaurants.filter(restaurant => {
          return restaurant.distance < 60;
        })
        return restaurants;
        // push fetched restaurants to the restaurants array
        // each restaurant should be an object with properties:
        // name, address, rating, foodType, hours, priceRange

      }).catch(err => {

        console.log('Error fetching restaurants: ', err);
        // handle errors

      })
    },

    getRestaurants: function() {
      // returns the list of restaurants
      return restaurants;
    }
  }
}])