var mongoose = require('mongoose');
var schema = require('./schema/index');

module.exports = {
  users: mongoose.model('users', schema.users),
  products: mongoose.model('products', schema.products),
  bills: mongoose.model('bills', schema.bills),
  categories: mongoose.model('categories', schema.categories),
  customers: mongoose.model('customers', schema.customers)
}
