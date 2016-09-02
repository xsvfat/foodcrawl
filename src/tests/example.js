/**
 * Some examples to get you going.
 * Chai Style: BDD/expect
 * http://chaijs.com/api/bdd/
 */

/**
 * Run tests in the terminal with the following command:
 * mocha filename.js
 */

//Dependencies
var chai = require('chai');
var expect = chai.expect;

//Use 'describe' to create a section
describe('Examples', function() {

  //'describe' statements can be nested to create sub-sections
  describe('someFunction()', function() {
    
    //'it' statements describe what the test is checking for
    //Descriptions should describe the intended behavior
    it('should be a string', function() {

      //Check type
      var foo = 'example';
      expect(foo).to.be.a('string');
    });

    it('should equal some value', function() {
    
      //Check equality
      var foo = 'bar';
      expect(foo).to.equal('bar');
    });
  });

  describe('someArray', function() {
    
    it('should have some length', function() {

      //Check for property
      var foo = [1,2,3];
      expect(foo).to.have.length(3);
    })

    it('should have a nested array with a specific length', function() {
      
      //Check for nested property
      var beverages = {
        tea: [1,2,3]
      };
      expect(beverages).to.have.property('tea').with.length(3);
    })
  });
});
