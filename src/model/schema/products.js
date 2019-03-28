var mongoose = require('mongoose');


var products = new mongoose.Schema({
    title: {
        type: String
    },
    imageLink: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    }
})

module.exports = products;