describe('Services', function() {
  // Run these tests with karma start from the command line
  
  // Import the corresponding module
  beforeEach(module('foodfood'));

  describe('RestaurantAndRoute factory', function() {
    var $httpBackend, RestaurantAndRoute;

    // inject the necessary dependencies
    beforeEach(inject(function (_$httpBackend_, _RestaurantAndRoute_) {
      $httpBackend = _$httpBackend_;
      RestaurantAndRoute = _RestaurantAndRoute_;
    }));

    // these tests just test for the existence of our methods
    it('should exist', function() {
      expect(RestaurantAndRoute).to.exist;
    });

    describe('fetchRestaurants', function() {
      it('should have a method `fetchRestaurants`', function() {
        expect(RestaurantAndRoute.fetchRestaurants).to.be.a('function');
      });

      it('should return a list of restaurants', function() {
        var mockResponse = [
        { name: 'Delicious Restaurant',
          rating: 5 },
        { title: 'Bad Restaurant',
          rating: 1 }
        ];

        $httpBackend.expect('POST', '/maps/submit').respond(mockResponse);

        // I'm running into problems right now due to login
        // It's posting a GET request to .views/login/html
        RestaurantAndRoute.fetchRestaurants().then(function (restaurants) {
          expect(restaurants).to.deep.equal(mockResponse);
        });

        $httpBackend.flush();
      });
    });

    describe('getRestaurants', function() {
      it('should have a method `getRestaurants`', function() {
        expect(RestaurantAndRoute.getRestaurants).to.be.a('function');
      });
      // These methods are all hard to test because they rely on side effects
      it('should return a list of restaurants', function() {
        var restaurants = [
          { name: 'Delicious Restaurant',
            rating: 5 },
          { title: 'Bad Restaurant',
            rating: 1 }
        ];
        /*
          This will return an empty array at the moment because restaurants is an empty array in services.js. I need to figure out a way to call fetchRestaurants with some mock data in order to populate the restaurants array.
        */
        expect(RestaurantAndRoute.getRestaurants()).to.equal(restaurants);
      });
    });

    it('should have a method `addMarkers`', function() {
      expect(RestaurantAndRoute.addMarkers).to.be.a('function');
    });

    it('should have a method `removeMarkers`', function() {
      expect(RestaurantAndRoute.removeMarkers).to.be.a('function');
    });

    it('should have a method `calculateAndDisplayRoute`', function() {
      expect(RestaurantAndRoute.calculateAndDisplayRoute).to.be.a('function');
    });

    it('should have a method `openInfoWindow`', function() {
      expect(RestaurantAndRoute.openInfoWindow).to.be.a('function');
    });

  });

});
