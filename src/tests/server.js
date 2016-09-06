var chai = require('chai');
var expect = chai.expect;
// var request = require('request');

describe('Server', function() {

  describe('Route handlers', function() {
    var handlers = require('../server/handlers.js');

    describe('getRoutes', function() {

      it('should be a function', function() {
        expect(handlers.getRoutes).to.be.a('function');
      });

      /**
       * Add these tests:
       * it should take two strings
       * it should return a promise that contains path data
       * it should query a string properly
       * it should provide all the required props to a ajax req
       * it should throw an error upon ajax failure
       */
      it('should return an object', function() {
        var result = handlers.getRoutes('San Francisco', 'San Jose');
        expect(result).to.be.instanceof(Object);
      });
    });

    describe('submit', function() {

      it('should be a function', function() {
        expect(handlers.getRoutes).to.be.a('function');
      });

      it('should throw an error for empty arguments', function(done) {
        // fix this test
        handlers.getRoutes(null, null)
          .then(function (response) {
            expect(!response);
            done();
          })
          .catch(function (error) {
            expect(error);
            done();
          });
      });
    });

    describe('getRestaurants', function() {
      var result, route;

      before(function (done) {
        handlers.getRoutes('1412 15th Street, SF, CA', '944 Market Street, SF, CA')
          .then(function (response) {
            route = JSON.parse(response.body).routes;
            done();
          });
      });

      it ('should be a function', function() {
        expect(handlers.getRestaurants).to.be.a('function');
      });

      it('should respond with an object containing route and restaurants properties', function (done) {
        var res = {
          send: function (input) {
            expect(input.route.length);
            expect(input.restaurants.length);
            done();
          }
        };

        handlers.getRestaurants(null, res, route);
      });

    });

  });

});