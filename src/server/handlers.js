var bb = require('bluebird');
var request = bb.promisify(require('request'));
var keys = require('./keys.js');
var qs = require('querystring');
var Yelp = require('yelp');
var _ = require('lodash');

const gmapsURL = 'https://maps.googleapis.com/maps/api/directions/json';

var yelp = new Yelp({
  'consumer_key': keys.yelp,
  'consumer_secret': keys.yelpSecret,
  'token': keys.yelpToken,
  'token_secret': keys.yelpTokenSecret
});

module.exports = {
  /*
   * Input: (String, String, Function) 
   * Output: Promise
   * Description: Given a starting and ending address, gives an object
   *              containing an array of routes in promise form.
   */
  getRoutes: function (origin, destination) {
    // Concatenate query parameters into HTTP request friendly string.
    let queryString = qs.stringify({
      origin: origin,
      destination: destination,
      key: keys.googleMaps
    });

    // Specify parameters for request.
    let options = {
      url: `${gmapsURL}?${queryString}`,
      method: 'GET'
    }; 
 
    // Make request to Google Directions API.
    return request(options);
  },

  /*
   * Input: Object
   * Output: Promise
   * Description: Takes a parameters object and returns a list
   *              of yelp provided data.
   */
  getRestaurants: (customParams) => {
    return yelp.search(customParams);
  },
};


