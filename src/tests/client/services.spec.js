describe('Services', function() {
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
    it('should exist', function () {
      expect(RestaurantAndRoute).to.exist;
    });

    describe('fetchRestaurants', function() {
      it('should have a method `fetchRestaurants`', function () {
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
          console.log('AAAAAA', restaurants);
          expect(restaurants).to.deep.equal(mockResponse);
        });

        $httpBackend.flush();
      });
    })

    it('should have a method `getRestaurants`', function () {
      expect(RestaurantAndRoute.getRestaurants).to.be.a('function');
    });

    it('should have a method `addMarkers`', function () {
      expect(RestaurantAndRoute.addMarkers).to.be.a('function');
    });

    it('should have a method `removeMarkers`', function () {
      expect(RestaurantAndRoute.removeMarkers).to.be.a('function');
    });

    it('should have a method `calculateAndDisplayRoute`', function () {
      expect(RestaurantAndRoute.calculateAndDisplayRoute).to.be.a('function');
    });

    it('should have a method `openInfoWindow`', function () {
      expect(RestaurantAndRoute.openInfoWindow).to.be.a('function');
    });

  });

});
