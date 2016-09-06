var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  restaurants: [{
    name: String,
    visits: Number
  }],
  locations: [String]
});

var restaurantSchema = new mongoose.Schema({
  name: String,
  rating: String,
  tags: [String],
  address: String,
  hours: String,
  priceRange: {
    min: String,
    max: String
  },
  visits: Number
})

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant
}