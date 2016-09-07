var bb = require('bluebird');
var request = bb.promisify(require('request'));
var request2 = require('request');
var keys = require('./keys.js');
var qs = require('querystring');
var Yelp = require('yelp');
var session = require('express-session');
var _ = require('lodash');
var User = require('./dbconfig/schema.js').User;

const gmapsURL = 'https://maps.googleapis.com/maps/api/directions/json';

var yelp = new Yelp({
  'consumer_key': keys.yelp,
  'consumer_secret': keys.yelpSecret,
  'token': keys.yelpToken,
  'token_secret': keys.yelpTokenSecret
});

module.exports = {
  login: (req, res, next) => {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password; // need to hash later

    // sets the current session to the logged in user
    req.session.username = username;
    res.send('Successfully signed in.');
  },

  signup: (req, res, next) => {
    console.log('signup: ', req.body);
    var username = req.body.username;
    var password = req.body.password; // need to hash later
    User.find({username: username}).then(users => {
      if (users.length) {
        res.send('That username already exists.');
      } else {
        // adds a new user to the database
        new User({username: username, password: password}).save().then(user => {
          console.log(user);
          res.send('New user added to database');
        })
      }
    });
  },



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
      // Parse nested object returned by Google's API to
      // specifically get Array of routes.
      var routesArray = JSON.parse(results.body).routes;

      // Call getRestaurants along the returned route.
      module.exports.getRestaurants(req, res, routesArray);
    })
    .catch(err => {
      console.log('Error requesting routes: ', err);
      res.end();
    });
  },

  /*
   * Input: Array
   * Output: Promise
   * Description: Takes in the route object returned by Google's API,
   *              and returns an array of restaurant objects from Yelp.
   */
  getRestaurants: (req, res, routesArray) => {

    // Object to be returned to the client. 
    // Stores route and restaurants in two seperate arrays.
    var responseObject = {
      route: routesArray,
      restaurants: [],
    };

    // Stores the steps along a route for querying Yelp.
    var stepsArray = [];

    // Checks to see if a step's length is too long, and chops it in half
    // if it is. Then it adds it to the steps array.
    var addStep = function (step) {
      
      // The base case.
      if (step.distance.value <= routesArray[0].legs[0].distance.value / 6) {
        stepsArray.push(step);
      } else {

        // Calculates the midpoint between the start and end of a step.
        var midpoint = {
          lat: (step.start_location.lat + step.end_location.lat) / 2,
          lng: (step.start_location.lng + step.end_location.lng) / 2,
        };

        // Chops off the first half of the step.
        var step1 = JSON.parse(JSON.stringify(step));
        step1['end_location'] = midpoint;
        step1.distance.value /= 2;

        // Chops off the second half of the step.
        var step2 = JSON.parse(JSON.stringify(step));
        step2['start_location'] = midpoint;
        step2.distance.value /= 2;
        
        // Recursively calls itself on each "half-step".
        addStep(step1);
        addStep(step2);
      }
    };

    // Calls addStep on every single step along a route.
    routesArray[0].legs.forEach(function (leg, index) {
      leg.steps.forEach(function (stepObj) {
        addStep(stepObj);
      });
    });

    // Keeps track of the number of Yelp queries we've made.
    var queryCounter = 0;

    // Makes a unique Yelp query for each step along the given route.
    stepsArray.forEach(function (step, index) {
      if (index > 20) { return; }

      // Calculate the geographical midpoint along each step of the journey.
      let midpointLatitude = (step.start_location.lat + step.end_location.lat) / 2;
      let midpointLongitude = (step.start_location.lng + step.end_location.lng) / 2;

      // Establish parameters for each individual yelp query.
      let searchParameters = {
        'radius_filter': Math.min((step.distance.value / 2), 39999),
        'll': `${midpointLatitude},${midpointLongitude}`,
        // 'category_filter': 'food',
        'term': 'restaurant'
      };

      // Query Yelp's API.
      yelp.search(searchParameters)

        // Sucess callback
        .then(function (searchResults) {
          // Add the returned businessees to the restauraunts array.
          responseObject.restaurants = responseObject.restaurants.concat(searchResults.businesses);
          
          // Send a response to the client if all requisite queries have been made.
          queryCounter++;
          queryCounter >= Math.min(21, stepsArray.length) ? res.send(responseObject) : null;
        }) 

        // Error callback
        .catch(function (error) {
          console.log('Yelp returned an error:', error);

          // Send a response to the client if all requisite queries have been made.
          queryCounter++;
          queryCounter >= Math.min(21, stepsArray.length) ? res.send(responseObject) : null;
        });
    });
  },
};





