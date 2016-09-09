var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  restaurants: [{
    name: String,
    visits: Number
  }],
  preferences: [String],
  locations: [String],
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }]
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
});

var addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  label: String,
  address: [String]
});

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Address = mongoose.model('Address', addressSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Address: Address
}