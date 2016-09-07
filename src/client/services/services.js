app.factory('RestaurantAndRoute', ['$http', function($http) {

  var restaurants = [];
  var markers = [];

  //Creates an info window for a marker
  let createInfoWindow = (place) => {
    //parse categories
    let categories = [];
    place.categories.forEach((category) => {
      categories.push(category[0]);
    });

    //info window html
    let displayHTML = `
      <div class="infoWindow">
        <h2 class="infoName">${place.name}</h2>
        <img class="ratingImg" src="${place.rating_img_url_small}"> 
        <p class="infoLocation">
          ${place.location.display_address[0]}<br>
          ${place.location.display_address[1]}<br>
          ${place.location.display_address[2]}<br>
          ${place.display_phone}
        </p>
        <p class="infoDescription">
          ${categories.join(', ')}
        </p>
      </div>`;

    //create info window
    let infoWindow = new google.maps.InfoWindow({
      content: displayHTML
    });

    return infoWindow;
  };

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

        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: place.name
        });

        //store for removal later
        markers.push(marker);

        //Display an info window when marker is clicked
        let infoWindow = createInfoWindow(place);
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
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
    }
  }
}])