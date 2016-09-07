app.factory('RestaurantAndRoute', ['$http', function($http) {

  var restaurants = [];
  var markers = [];

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
          return restaurant.distance;
        })

        // resolve restaurants for promise chaining
        return restaurants;

      }).catch(err => {
        console.log('Error fetching restaurants: ', err);
      })
    },

    getRestaurants: function() {
      return restaurants;
    },

    /**
     * Input: (Map, Array of Yelp Objects)
     * Output: Undefined
     * Description: Adds a list of markers to a map
     */
    addMarkers: (map) => {
      restaurants.forEach((place) => {
        let lat = place.location.coordinate.latitude;
        let lng = place.location.coordinate.longitude;

        markers.push(new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: place.name
        }));
      });
    },

    /**
     * Output: Undefined
     * Description: Removes a list of Markers from their map
     */
    removeMarkers: () => {
      markers.forEach((marker) => {
        marker.setMap(null);
        marker = null;
      });
    },

    /*
      Input: DirectionsService instance, DirectionsRenderer instance, start string, end string
      Output: null
      Description: Renders a route to the map with the given start and end points.
    */
    calculateAndDisplayRoute: (directionsService, directionsDisplay, start, end) => {
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

  }
}])
