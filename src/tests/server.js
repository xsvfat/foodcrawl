var chai = require('chai');
var expect = chai.expect;

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

      it('should throw an error for empty arguments', function() {
        // fix this test
        expect(false).to.equal(true);
      })
    });

    describe('getRestaurants', function() {
      
      it ('should be a function', function() {
        expect(handlers.getRestaurants).to.be.a('function');
      })
    })

  });

});