var chai = require('chai');
var expect = chai.expect;

describe('Client', function() {

  describe('handlers.js', function() {
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
    });

    describe('submit', function() {
      it('should be a function', function() {
        expect(handlers.getRoutes).to.be.a('function');
      })
    });
  });

  //Add more subsections
});