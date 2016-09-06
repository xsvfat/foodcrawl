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
          return restaurant.distance < 60;
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
     * Input: Yelp Object
     * Output: Undefined
     * Description: Creates an info window
     */
    createInfoWindow: (place) => {
      //parse categories
      var categories = [];
      place.categories.forEach((category) => {
        category[0].push(categories);
      });
      console.log('categories: ', categories);

      //info window html
      var displayHTML = `
        <div class="infoWindow">
          <img class="infoImage" src="${place.image_url}"> 
          <h2 class="infoName">${place.name}</h2>
          <p class="infoLocation">
            ${place.display_address[0]}<br>
            ${place.display_address[1]}<br>
            ${place.display_address[2]}<br>
            ${place.display_phone}
          </p>
          <p class="infoDescription">
            ${categories.join(', ')}
          </p>
        </div>`;

      //create info window
      var infoWindow = new google.maps.InfoWindow({
        content: displayHTML
      });

      return infoWindow;
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
    }
  }
}])