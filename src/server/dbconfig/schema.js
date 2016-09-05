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
  foodType: String,
  address: String,
  hours: String,
  priceRange: String,
  visits: Number
})