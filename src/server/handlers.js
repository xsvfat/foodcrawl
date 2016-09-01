var request = require('request');
var keys = require('./keys.js');
var qs = require('querystring');
var bb = require('bluebird');

const URL = 'https://maps.googleapis.com/maps/api/directions/json';



module.exports = {
  /*
   * Input: (String, String, Function) 
   * Output: Object
   * Description: Given a starting and ending address, gives an object
   *              containing an array of routes.
   */
  getRoutes: function (origin, destination, callback) {
    
    // Concatenate query parameters into HTTP request friendly string.
    let queryString = qs.stringify({
      origin: origin,
      destination: destination,
      key: keys.googleMaps
    });

    // Specify parameters for request.
    let options = {
      url: `${URL}?${queryString}`,
      method: 'GET'
    }; 
 
    // Make request to Google Directions API.
    request(options, (error, results) => {
      error ? callback(error) : callback(results);
    });
  },

  // Takes form data from submit
  // Outputs routes or addresses for the map
  submit: function(req, res, next) {
    console.log(req.body);
    res.end();
  }

};