var bb = require('bluebird');
var request = bb.promisify(require('request'));
var request2 = require('request');
var keys = require('./keys.js');
var qs = require('querystring');
var Yelp = require('yelp');
var session = require('express-session');
var _ = require('lodash');
var User = require('./dbconfig/schema.js').User;
var Address = require('./dbconfig/schema.js').Address;

const gmapsURL = 'https://maps.googleapis.com/maps/api/directions/json';

var yelp = new Yelp({
  'consumer_key': keys.yelp,
  'consumer_secret': keys.yelpSecret,
  'token': keys.yelpToken,
  'token_secret': keys.yelpTokenSecret
});

module.exports = {
  login: (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password; // need to hash later

    User.findOne({username: username, password: password}).then(user => {
      if (user) {
        // sets the current session to the logged in user
        // req.session.username = username;
        res.send({message: 'Successfully signed in.', valid: true});
      } else {
        res.send({message: 'Invalid username and password.', valid: false});
      }
    })
  },

  signup: (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password; // need to hash later
    User.find({username: username}).then(users => {
      if (users.length) {
        res.send({message: 'That username already exists.', valid: false});
      } else {
        // adds a new user to the database
        new User({username: username, password: password}).save().then(user => {
          // req.session.username = username;
          res.send({message: 'New user added to database', valid: true});
        })
      }
    });
  },

  saveOptions: (req, res, next) => {
    // updates user preferences in the database
    var username = req.body.username;
    var prefs = req.body.userPrefs;
    User.findOneAndUpdate({username: username},
                          {$set: {preferences: prefs}}, 
                          {new: true}, 
                          (err, result) => {
      if (err) {
        res.send({message: 'Error updating preferences.', valid: false});
      } else {
        res.send({message: 'Preferences updated.', valid: true});
      }
    })
  },

  getOptions: (req, res, next) => {
    // sends user preferences to the client
    var username = req.query.user;
    User.findOne({username: username}).then(user => {
      res.send(user.preferences);
    }).catch(err => {
      res.send('Error retrieving preferences.');
    })
  },


  /*
   * Input: (String, String, Function) 
   * Output: Promise
   * Description: Given a starting and ending address, gives an object
   *              containing an array of routes in promise form.
   */
  getRoutes: function (origin, destination, mode) {
    console.log(mode);
    // Concatenate query parameters into HTTP request friendly string.
    let queryString = qs.stringify({
      origin: origin,
      destination: destination,
      key: keys.googleMaps,
      mode: mode,
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
    module.exports.getRoutes(req.body.start, req.body.end, req.body.mode)
    .then(results => {
      // Parse nested object returned by Google's API to
      // specifically get Array of routes.
      var routesArray = JSON.parse(results.body).routes;


      User.findOne({
        username: req.body.user,
      }).then(function (response) {

        // Call getRestaurants along the returned route.
        module.exports.getRestaurants(req, res, routesArray, response.preferences);

      }).catch(function (error) {
        
        // Call getRestaurants along the returned route.
        module.exports.getRestaurants(req, res, routesArray);

      });
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
  getRestaurants: (req, res, routesArray, preferences) => {
    preferences = preferences || [];

    console.log(preferences.join(' ') + ' restaurants');
    // Object to be returned to the client. 
    // Stores route and restaurants in two seperate arrays.
    var responseObject = {
      route: routesArray,
      restaurants: [],
    };

    // Stores the segments along a route for querying Yelp.
    var segmentsArray = [];

    // Stores all of the Google defined "steps" along a route.
    var steps = [];

    // Determine the total length of a route in meters.
    var totalRouteDistance = 0;
    routesArray[0].legs.forEach(function (leg) {
      totalRouteDistance += leg.distance.value;
      steps = steps.concat(leg.steps);
    });

    // Calculates the length of the segments produced by cutting a given route into 10ths.
    var averageSegmentLength = totalRouteDistance / 10;

    // Breaks down all of Google's given 'steps' into 10 uniform segments of equal length.
    var start, end;
    var distanceFromTarget = averageSegmentLength / 2;
    
    // Iterate over each step along a route.
    for (var i = 0; i < steps.length; i++) {

      // Check if a segment's target midpoint lies along a given step.
      if (steps[i].distance.value >= distanceFromTarget) {
        
        // Grab the step's start and stop coordinates.
        start = steps[i].start_location;
        end = steps[i].end_location;

        // Calculate the midpoint of the given segment using MATH!
        var midpoint = {
          lat: start.lat + ((end.lat - start.lat) / (steps[i].distance.value / distanceFromTarget)),
          lng: start.lng + ((end.lng - start.lng) / (steps[i].distance.value / distanceFromTarget)),
        };
        
        // Generate the appropriate segment object and add it to the storage array.
        segmentsArray.push({
          distance: averageSegmentLength,
          midpoint: midpoint,
        });

        // Chop off the beginning of a given step that has already been evaluated.
        start = midpoint;
        steps[i].distance.value -= distanceFromTarget;
        distanceFromTarget = averageSegmentLength;
        i--;
      } else {

        // If the step doesn't contain the midpoint for a segment,
        // move on to the next step and decrease the remaining distance from target
        // by the step's distance.
        distanceFromTarget -= steps[i].distance.value;
      }
    }


    // Keeps track of the number of Yelp queries we've made.
    var queryCounter = 0;

    // Makes a unique Yelp query for each step along the given route.
    segmentsArray.forEach(function (step, index) {
      // console.log(step);

      // Establish parameters for each individual yelp query.
      let searchParameters = {
        'radius_filter': Math.min((step.distance / 1.7), 39999),
        'll': `${step.midpoint.lat},${step.midpoint.lng}`,
        'category_filter': 'restaurants',
        'term': preferences.join('_') + '_restaurant'
      };

      // Query Yelp's API.
      yelp.search(searchParameters)

        // Sucess callback
        .then(function (searchResults) {

          var validBusinesses = searchResults.businesses.filter(function (item) {
            return !!item.location.coordinate;
          })
          
          // Add the returned businessees to the restauraunts array.
          responseObject.restaurants = responseObject.restaurants.concat(validBusinesses);

          responseObject.restaurants = _.uniqBy(responseObject.restaurants, 'id');

          // Send a response to the client if all requisite queries have been made.
          queryCounter++;
          queryCounter >= segmentsArray.length ? res.send(responseObject) : null;
        }) 

        // Error callback
        .catch(function (error) {
          console.log('Yelp returned an error:', error);

          // Send a response to the client if all requisite queries have been made.
          queryCounter++;
          queryCounter >= segmentsArray.length ? res.send(responseObject) : null;
        });
    });
  },

  /**
   * Input: String
   * Output: Array
   * Description: Returns a list of addresses for a specific user
   */
  getAddresses: (req, res, next) => {
    let user = req.query.user;

    //get user id
    User.findOne({username: user})
    .then(user => {
      if (user) {
        return user;
      } else {
        console.log('No User');
      }
    })

    //search by addresses user id
    .then(user => {
      return Address.find({user: user._id});
    })

    .then(addresses => {
      res.send(addresses);
    })

    .catch(error => {
      console.log('Error getting addresses: ', error);
    })
  },

  /**
   * Input: Object
   * Output: Undefined
   * Description: Saves a new address
   */
  saveAddress: (req, res, next) => {
    let address = req.body;

    //Get user id by username
    User.findOne({username: address.user})
    .then(user => {
      //create new address
      return new Address({
        user: user._id,
        //address lines
        label: address.label,
        address: [address.one, address.two, address.three]
      }).save();
    })
    .then(() => {
      res.send();
    })
    .catch(error => {
      console.log('Error saving address: ', error);
    })
  }
};
