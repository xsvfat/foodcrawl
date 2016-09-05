var bb = require('bluebird');
var request = bb.promisify(require('request'));
var request2 = require('request');
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

  // Takes form data from submit
  // Outputs routes or addresses for the map
  submit: function(req, res, next) {
    module.exports.getRoutes(req.body.start, req.body.end)
    .then(results => {
      module.exports.getRestaurants(results);
      res.send(results);
    })
    .catch(err => {
      console.log('Error requesting routes: ', err);
      res.end();
    })
  },

  /*
   * Input: Object
   * Output: Promise
   * Description: Takes in the route object returned by Google's API,
   *              and returns an array of restaurant objects from Yelp.
   */
  getRestaurants: (routeObj) => {
    console.log(JSON.parse(routeObj.body).routes[0].legs[0].steps);
  },
};





